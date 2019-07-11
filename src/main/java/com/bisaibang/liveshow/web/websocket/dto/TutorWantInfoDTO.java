package com.bisaibang.liveshow.web.websocket.dto;

import java.util.HashMap;
import java.util.Map;

public class TutorWantInfoDTO {
    public final String type = "tutor_want_info";
    private Map<Long, Boolean> chosens = new HashMap<>();

    public Map<Long, Boolean> getChosens() {
        return chosens;
    }

    public void setChosens(Map<Long, Boolean> chosens) {
        this.chosens = chosens;
    }

    @Override
    public String toString() {
        return "ContestantCountInfoDTO{" +
            "type='" + type + '\'' +
            ", chosens=" + chosens +
            '}';
    }
}
