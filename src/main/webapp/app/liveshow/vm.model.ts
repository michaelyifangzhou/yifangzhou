import { Contestent } from 'app/shared/model/contestent.model';

export type WebsocketData = IVideoInfo | IContestantCountInfo | ITutorWantInfo;

export interface IVideoInfo {
    type: 'video_info';
    contestant: Contestent;
    liveTime: number;
    playing: boolean;
}

export interface IContestantCountInfo {
    type: 'contestant_count_info';
    counts: { [id: string]: number };
}

export interface ITutorWantInfo {
    type: 'tutor_want_info';
    chosens: { [id: string]: boolean };
}
