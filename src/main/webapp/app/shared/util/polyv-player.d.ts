export interface polyvPlayerConstructorParams {
    wrap?: string | HTMLElement;
    width?: number | string;
    height?: number | string;
    vid: string;
    loop?: boolean;
    autoplay?: boolean;
    volume?: number;
    flash?: boolean;
    df?: number;
    hideRepeat?: boolean;
    code?: string;
    speed?: false | number[];
    showHd?: boolean;
    ignoreIE?: boolean;
    watchStartTime?: number;
    watchEndTime?: number;
    skinLocation?: number;
    ban_history_time?: string;
    hideSwitchPlayer?: boolean;
    priorityMode?: string;
    audioMode?: boolean;
    videoMode?: boolean;
    screenshot?: boolean;
    ban_seek_by_limit_time?: 'on' | 'off';
    ban_seek?: 'on' | 'off';
    loading_bg_img?: string;
    ban_record_interaction_right_answer?: string;
    playsafe?: (vid?: string, next) => void | string;
    ts?: number;
    sign?: string;
    adSkip?: boolean;
    adMatter?: any[];
    logo?: any;
    teaserSkip?: boolean;
    teaser_show?: number;
    teaser_url?: string;
    teaser_time?: number;
    statistics?: any;
}

declare class polyvPlayer {
    constructor(videoInfo: polyvPlayerConstructorParams);

    public isSupportHTML5: boolean;
    public HTML5: false | any;
    public flash: false | any;
    public toFlash: () => void;
    public toHTML5: () => void;
    public destroy: () => void;
    public on: (name: 'HTML5Load' | 'serverError', handle: Function) => void;
    public changeStatistics: (session_id, param1, param2, param3, param4) => void;
    public getCurrentMode: () => 'video' | 'audio';
    public setMode: (mode: 'video' | 'audio') => void;
    public changeVid: (videoInfo: polyvPlayerConstructorParams | string) => void;
    public j2s_getCurrentTime: () => number;
    public j2s_getDuration: () => number;
    public j2s_pauseVideo: () => void;
    public j2s_resumeVideo: () => void;
    public j2s_stopVideo: () => void;
    public j2s_stayInVideoTime: () => void;
    public j2s_realPlayVideoTime: () => number;
    public j2s_seekVideo: (second: number) => void;
    public j2s_setVolume: () => void;
    public changeRepeat: () => void;
    public toggleFullscreen: () => void;
}
