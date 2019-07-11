package com.bisaibang.liveshow.web.websocket;

import com.bisaibang.liveshow.domain.Contestent;
import com.bisaibang.liveshow.domain.User;
import com.bisaibang.liveshow.domain.vm.CurrentRunningContestantPO;
import com.bisaibang.liveshow.repository.ContestentRepository;
import com.bisaibang.liveshow.repository.UserRepository;
import com.bisaibang.liveshow.security.SecurityUtils;
import com.bisaibang.liveshow.web.rest.errors.CustomParameterizedException;
import com.bisaibang.liveshow.web.websocket.dto.ContestantCountInfoDTO;
import com.bisaibang.liveshow.web.websocket.dto.TutorWantInfoDTO;
import com.bisaibang.liveshow.web.websocket.dto.VideoInfoDTO;
import com.codahale.metrics.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

/**
 * @author arslan
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LiveshowService {

    private static final Logger log = LoggerFactory.getLogger(LiveshowService.class);

    private final SimpMessageSendingOperations messagingTemplate;
    private final ContestentRepository contestentRepository;
    private final UserRepository userRepository;

    private final CurrentRunningContestantPO currentRunningContestant;
    private final Map<Long, Long> counts = Collections.synchronizedMap(new HashMap<>());
    private final Map<Long, Boolean> chosens = Collections.synchronizedMap(new HashMap<>());

    public LiveshowService(
        SimpMessageSendingOperations messagingTemplate,
        CurrentRunningContestantPO currentRunningContestant,
        ContestentRepository contestentRepository,
        UserRepository userRepository
    ) {
        this.messagingTemplate = messagingTemplate;
        this.currentRunningContestant = currentRunningContestant;
        this.contestentRepository = contestentRepository;
        this.userRepository = userRepository;
        this.updateCounts();
        this.updateWants();
    }

    /**
     * 定时向长连接中发送视频播放的时间
     */
    @Scheduled(cron = "*/5 * * * * *")
    public void sendVideoInfo() {
        synchronized (currentRunningContestant) {
            VideoInfoDTO videoInfoDTO = new VideoInfoDTO();
            videoInfoDTO.setContestant(currentRunningContestant.getContestent());
            videoInfoDTO.setPlaying(currentRunningContestant.isPlaying());
            long durationInMili = currentRunningContestant.isPlaying() ? Instant.now().toEpochMilli() - currentRunningContestant.getStartTime().toEpochMilli() : 0;
            videoInfoDTO.setLiveTime((durationInMili + currentRunningContestant.getRunTime()) / 1000);
            this.messagingTemplate.convertAndSend("/topic/liveshow", videoInfoDTO);
        }
    }

    /**
     * 定时向长连接中发送导师当前的队伍人数
     */
    @Scheduled(cron = "*/5 * * * * *")
    public void sendContestantCount() {
        ContestantCountInfoDTO countDTO = new ContestantCountInfoDTO();
        countDTO.setCounts(this.counts);
        this.messagingTemplate.convertAndSend("/topic/liveshow", countDTO);
    }

    /**
     * 定时向长连接中发送导师是否已进行选择
     */
    @Scheduled(cron = "*/5 * * * * *")
    public void sendTutorWant() {
        TutorWantInfoDTO wantInfoDTO = new TutorWantInfoDTO();
        wantInfoDTO.setChosens(this.chosens);
        this.messagingTemplate.convertAndSend("/topic/liveshow", wantInfoDTO);
    }

    /**
     * 开始播放下一个选手的视频
     *
     * @param id 选手id
     */
    @PutMapping("/bsb-live/change/id/{id}")
    @Timed
    public void changeCurrentContestant(@PathVariable Long id) {
        synchronized (currentRunningContestant) {
            currentRunningContestant.setContestent(contestentRepository.findOneWithEagerRelationships(id).orElseThrow(() -> new CustomParameterizedException("")));
            currentRunningContestant.setStartTime(Instant.now());
            currentRunningContestant.setRunTime(0L);
            currentRunningContestant.setPlaying(false);
        }
        this.sendVideoInfo();
        this.updateWants();
        this.sendTutorWant();
        this.updateCounts();
        this.sendContestantCount();
    }

    /**
     * 暂停、开始播放当前视频
     */
    @PostMapping("/bsb-live/start-pause")
    public Map<String, String> startPauseVideo() {
        synchronized (currentRunningContestant) {
            if (currentRunningContestant.isPlaying()) {
                currentRunningContestant.setPlaying(false);
                currentRunningContestant.setRunTime(currentRunningContestant.getRunTime() + Instant.now().toEpochMilli() - currentRunningContestant.getStartTime().toEpochMilli());
                this.sendVideoInfo();
                return new HashMap<String, String>(1) {{
                    put("message", "paused");
                }};
            } else {
                currentRunningContestant.setPlaying(true);
                currentRunningContestant.setStartTime(Instant.now());
                this.sendVideoInfo();
                return new HashMap<String, String>(1) {{
                    put("message", "started");
                }};
            }
        }
    }

    /**
     * 快进，快退若干秒
     */
    @PostMapping("/bsb-live/backward-forward")
    public void startPauseVideo(@RequestBody Long timeInterval) {
        synchronized (currentRunningContestant) {
            currentRunningContestant.setRunTime(currentRunningContestant.getRunTime() + timeInterval * 1000);
            this.sendVideoInfo();
        }
    }

    /**
     * 导师选择选手
     *
     * @return contestant
     */
    @PatchMapping("/bsb-live/i-want-u")
    @Timed
    public Contestent tutorChoosesContestant() {
        User tutor = SecurityUtils.getCurrentUserLogin()
            .flatMap(userRepository::findOneByLogin)
            .orElseThrow(() -> new InsufficientAuthenticationException(""));

        return contestentRepository.findOneWithEagerRelationships(currentRunningContestant.getContestent().getId())
            .map(contestent -> {
                contestent.addChosen(tutor);
                contestentRepository.save(contestent);
                this.updateWants();
                this.sendTutorWant();
                return contestent;
            })
            .orElseThrow(() -> new CustomParameterizedException("id 错误"));
    }

    /**
     * 选手反选导师
     *
     * @param id         选手id
     * @param tutorLogin 导师 login
     * @return contestant
     */
    @PatchMapping("/bsb-live/contestant-choose-tutor/{id}")
    @Timed
    @PreAuthorize("hasRole('ADMIN')")
    public Contestent contestantChoosesTutor(@PathVariable Long id, @RequestBody String tutorLogin) {
        User tutor =
            tutorLogin == null || "null".equals(tutorLogin) || "NULL".equals(tutorLogin) ?
            null :
            userRepository.findOneByLogin(tutorLogin)
                .orElseThrow(() -> new CustomParameterizedException("导师登录名错误"));

        return contestentRepository.findOneWithEagerRelationships(id)
            .map(contestent -> {
//                if (!contestent.getChosens().contains(tutor)) {
//                    throw new CustomParameterizedException("导师未选择该选手");
//                }
                contestent.setTutor(tutor);
                contestentRepository.save(contestent);
                this.updateCounts();
                this.sendContestantCount();
                return contestent;
            })
            .orElseThrow(() -> new CustomParameterizedException("id 错误"));
    }

    private void updateCounts() {
        Map<Long, Long> newCounts = contestentRepository.findAll()
            .stream()
            .filter(contestent -> contestent.getTutor() != null && contestent.getTutor().isTutor())
            .collect(Collectors.groupingBy(contestent -> contestent.getTutor().getId(), Collectors.counting()));

        userRepository.findAllByTutorIsTrue()
            .forEach(user -> newCounts.putIfAbsent(user.getId(), 0L));

        synchronized (counts) {
            counts.clear();
            counts.putAll(newCounts);
        }
    }

    private void updateWants() {
        synchronized (chosens) {
            Set<User> nowChosen = contestentRepository.findById(currentRunningContestant.getContestent().getId())
                .map(Contestent::getChosens)
                .orElse(new HashSet<>());
            chosens.clear();
            userRepository.findAllByTutorIsTrue()
                .forEach(user -> chosens.put(user.getId(), Boolean.FALSE));
            nowChosen.forEach(user -> chosens.put(user.getId(), Boolean.TRUE));
        }
    }

    //教师为他的学生打分
    @PutMapping("/bsb-live/giveScore/{id}")
    public User giveScore(@PathVariable Long id,@RequestParam Long score){
        User user=userRepository.findOneWithAuthoritiesById(id).get();
        List<Contestent> clist=contestentRepository.findByTutorIsCurrentUser();
        Set<User> allusers=clist.get(0).getChosens();
        for(int i=1;i<clist.size();i++){
            allusers.addAll(clist.get(i).getChosens());
        }
        if(!allusers.contains(user)){
            throw new CustomParameterizedException("他不是你的学生");
        }
        user.setScore(score);
        userRepository.save(user);
        return user;
    }

    //查询所有学生成绩按从大到小顺序排列
    @GetMapping("/findAllUserSortedByScore")
    public List<User> findAllUserSortedByScore(){
        List<User> players=userRepository.findAllByTutorIsFalse();
        List<User> finallist=
            players.stream().
                sorted((p1,p2) ->p1.getScore().compareTo(p2.getScore())).
                collect(Collectors.toList());
        reverse(finallist);
        return finallist;
    }

    public void reverse(List<User> players){
        int size=players.size();
        for(int i=0;i<=(players.size()-1)/2;i++){
            User tmp=new User();
            tmp=players.get(size-1-i);
            players.set(size-1-i,players.get(i));
            players.set(i,tmp);
        }
    }
}
