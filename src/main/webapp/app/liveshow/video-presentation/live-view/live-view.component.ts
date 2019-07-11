import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService, IUser } from 'app/core';
import { IContestantCountInfo, ITutorWantInfo } from 'app/liveshow/vm.model';
import { FlashVideoService } from 'app/liveshow/flash-video.service';

@Component({
    selector: 'bsb-live-view',
    templateUrl: './live-view.component.html',
    styleUrls: ['./live-view.component.scss']
})
export class LiveViewComponent implements OnInit {
    tutors: IUser[];
    contestantCountsOfEachTutor: { [id: string]: null[] } = {};
    didTutorChoseContestant: { [id: string]: boolean } = {};
    @ViewChild('videoElement') video;
    showingVideo: boolean[] = [];
    isAddContestant: boolean;

    constructor(private accountService: AccountService, private flashVideoService: FlashVideoService) {}

    ngOnInit() {
        this.accountService.getTutors().subscribe(res => {
            this.tutors = res.body;
        });
    }

    public onContestantCountInfo({ counts }: IContestantCountInfo) {
        this.contestantCountsOfEachTutor = {};
        for (const key in counts) {
            if (counts.hasOwnProperty(key)) {
                this.isAddContestant = this.contestantCountsOfEachTutor[key].length !== counts[key];
                this.contestantCountsOfEachTutor[key] = Array(counts[key]);
            }
        }
    }

    public onTutorWantInfo({ chosens }: ITutorWantInfo) {
        for (const tutorId in this.didTutorChoseContestant) {
            if (this.didTutorChoseContestant.hasOwnProperty(tutorId)) {
                if (this.didTutorChoseContestant[tutorId] === false && chosens[tutorId] === true) {
                    this.showSelectionVideoByTutor(this.tutors.findIndex(t => String(t.id) === tutorId));
                }
            }
        }
        this.didTutorChoseContestant = chosens;
    }

    showSelectionVideoByTutor(index) {
        this.showingVideo[index] = true;
        const src = `../../../../content/video/${index}.webm`;
        const leftOffset = 37 - 250;
        const distance = 440;
        this.flashVideoService
            .showVideo(25, leftOffset + distance * index, 700, src, document.getElementsByClassName('teacher-content')[0])
            .then(() => (this.showingVideo[index] = false));
    }
}
