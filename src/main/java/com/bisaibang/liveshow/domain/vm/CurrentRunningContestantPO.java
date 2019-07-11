package com.bisaibang.liveshow.domain.vm;

import com.bisaibang.liveshow.domain.Contestent;

import java.time.Instant;

/**
 * @author arslan
 */
public class CurrentRunningContestantPO {
    private Contestent contestent;
    private Instant startTime;
    private Boolean playing;
    private Long runTime;

    public Long getRunTime() {
        return runTime;
    }

    public void setRunTime(Long runTime) {
        this.runTime = runTime;
    }


    public Boolean isPlaying() {
        return playing;
    }

    public void setPlaying(Boolean playing) {
        this.playing = playing;
    }

    public Contestent getContestent() {
        return contestent;
    }

    public void setContestent(Contestent contestent) {
        this.contestent = contestent;
    }

    public Instant getStartTime() {
        return startTime;
    }

    public void setStartTime(Instant startTime) {
        this.startTime = startTime;
    }

    @Override
    public String toString() {
        return "CurrentRunningContestantPO{" +
            "contestent=" + contestent +
            ", startTime=" + startTime +
            ", playing=" + playing +
            ", runTime=" + runTime +
            '}';
    }
}
