package com.bisaibang.liveshow.web.websocket.dto;

import com.bisaibang.liveshow.domain.Contestent;

public class VideoInfoDTO {
    public final String type = "video_info";
    private Contestent contestant;
    private Long liveTime;
    private Boolean playing;

    public Boolean getPlaying() {
        return playing;
    }

    public void setPlaying(Boolean playing) {
        this.playing = playing;
    }

    public Contestent getContestant() {
        return contestant;
    }

    public void setContestant(Contestent contestant) {
        this.contestant = contestant;
    }

    public Long getLiveTime() {
        return liveTime;
    }

    public void setLiveTime(Long liveTime) {
        this.liveTime = liveTime;
    }

    @Override
    public String toString() {
        return "VideoInfoDTO{" +
            "type='" + type + '\'' +
            ", contestant=" + contestant +
            ", liveTime=" + liveTime +
            ", playing=" + playing +
            '}';
    }
}
