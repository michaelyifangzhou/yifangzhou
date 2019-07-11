import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataReceiverService } from '../data-receiver.service';
import { polyvPlayer, polyvPlayerConstructorParams } from 'app/shared/util/polyv-player';
import { IVideoInfo, WebsocketData } from 'app/liveshow/vm.model';
import { IContestent } from 'app/shared/model/contestent.model';
import { AccountService, IUser } from 'app/core';
import { JhiEventManager } from 'ng-jhipster';
import { LiveViewComponent } from './live-view/live-view.component';
import { TutorViewComponent } from './tutor-view/tutor-view.component';

@Component({
    selector: 'bsb-video-presentation',
    templateUrl: './video-presentation.component.html',
    styleUrls: ['./video-presentation.component.scss']
})
export class VideoPresentationComponent implements OnInit, OnDestroy {
    account: IUser;
    contestant: IContestent = {};
    player: polyvPlayer;
    videoInfo: polyvPlayerConstructorParams = {
        wrap: '#player',
        width: 1160,
        height: 552,
        loop: true,
        autoplay: false,
        df: 3,
        skinLocation: 0,
        volume: 0.15,
        ban_seek: 'on',
        speed: false,
        vid: 'e8888b74d1229efec6b4712e17cb6b7a_e'
    };
    @ViewChild(LiveViewComponent) liveView?: LiveViewComponent;
    @ViewChild(TutorViewComponent) tutorView?: TutorViewComponent;

    constructor(
        private dataReceiverService: DataReceiverService,
        private accountService: AccountService,
        private eventManager: JhiEventManager
    ) {}

    ngOnInit() {
        this.player = new polyvPlayer(this.videoInfo);
        this.accountService.identity().then(account => {
            this.account = account;
            this.onAfterAuthentication();
        });
        this.registerAuthenticationSuccess();
    }

    ngOnDestroy() {
        this.dataReceiverService.unsubscribe();
    }

    private registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', () => {
            this.accountService.identity().then(account => {
                this.account = account;
                this.onAfterAuthentication();
            });
        });
    }

    private onAfterAuthentication() {
        this.dataReceiverService.connect();
        this.dataReceiverService.subscribe();
        this.dataReceiverService.receive().subscribe((data: WebsocketData) => {
            if (data.type === 'video_info') {
                this.contestant = data.contestant;
                this.initPlayer(data);
            }
            if (data.type === 'contestant_count_info') {
                if (this.liveView) {
                    this.liveView.onContestantCountInfo(data);
                }
                if (this.tutorView) {
                    this.tutorView.onContestantCountInfo(data);
                }
            }
            if (data.type === 'tutor_want_info') {
                if (this.liveView) {
                    this.liveView.onTutorWantInfo(data);
                }
                if (this.tutorView) {
                    this.tutorView.onTutorWantInfo(data);
                }
            }
        }, console.log);
    }

    private initPlayer(data: IVideoInfo) {
        if (data.contestant.video !== this.videoInfo.vid) {
            this.videoInfo.vid = data.contestant.video;
            this.player.changeVid(this.videoInfo);
        }
        if (!data.playing) {
            this.player.j2s_pauseVideo();
        } else {
            this.player.j2s_resumeVideo();
        }
        this.setVideoTime(data.liveTime);
    }

    private setVideoTime(liveTime: number) {
        const time = liveTime % this.player.j2s_getDuration();
        const currentTime = this.player.j2s_getCurrentTime();
        if (time > currentTime + 3 || time < currentTime - 3) {
            try {
                this.player.j2s_seekVideo(time);
            } catch (e) {
                //
            }
        }
    }
}
