package com.bisaibang.liveshow.config.audit;

import com.bisaibang.liveshow.domain.Contestent;
import com.bisaibang.liveshow.domain.vm.CurrentRunningContestantPO;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Instant;

/**
 * @author arslan
 */
@Configuration
public class GlobalVariables {
    @Bean
    public CurrentRunningContestantPO currentRunningContestant() {
        final CurrentRunningContestantPO contestant = new CurrentRunningContestantPO();
        Contestent example = new Contestent();
        example.setId(0L);
        example.setVideo("e8888b74d1229efec6b4712e17cb6b7a_e");
        contestant.setPlaying(false);
        contestant.setRunTime(0L);
        contestant.setContestent(example);
        contestant.setStartTime(Instant.now());
        return contestant;
    }
}
