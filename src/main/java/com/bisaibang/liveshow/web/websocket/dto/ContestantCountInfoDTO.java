package com.bisaibang.liveshow.web.websocket.dto;

import java.util.HashMap;
import java.util.Map;

public class ContestantCountInfoDTO {
    public final String type = "contestant_count_info";
    private Map<Long, Long> counts = new HashMap<>();

    public Map<Long, Long> getCounts() {
        return counts;
    }

    public void setCounts(Map<Long, Long> counts) {
        this.counts = counts;
    }

    @Override
    public String toString() {
        return "ContestantCountInfoDTO{" +
            "type='" + type + '\'' +
            ", counts=" + counts +
            '}';
    }
}
