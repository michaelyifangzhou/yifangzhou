import { Component, OnDestroy, OnInit } from '@angular/core';
import { LiveShowService } from 'app/liveshow/live-show.service';
import { ContestentService } from 'app/entities/contestent';
import { IContestent } from 'app/shared/model/contestent.model';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';
import { AccountService, IUser } from 'app/core';

@Component({
    selector: 'jhi-control-panel',
    templateUrl: './control-panel.component.html',
    styles: []
})
export class ControlPanelComponent implements OnInit, OnDestroy {
    nextId: number;
    contestents: IContestent[];
    eventSubscriber: Subscription;
    tutors: IUser[];

    constructor(
        private liveShowService: LiveShowService,
        protected eventManager: JhiEventManager,
        private contestentService: ContestentService,
        private jhiAlertService: JhiAlertService,
        private accountService: AccountService
    ) {}

    ngOnInit() {
        this.loadAll();
        this.registerChangeInContestents();
    }

    loadAll() {
        this.contestentService.query().subscribe(res => {
            this.contestents = res.body;
        }, console.log);

        this.accountService.getTutors().subscribe(res => {
            this.tutors = res.body;
        });
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInContestents() {
        this.eventSubscriber = this.eventManager.subscribe('contestentListModification', response => this.loadAll());
    }

    startPauseVideo() {
        this.liveShowService.startPauseVideo().subscribe(console.log);
    }

    changeCurrentContestant() {
        this.liveShowService.changeCurrentContestant(this.nextId).subscribe(console.log);
    }

    backwardForward(time: number) {
        this.liveShowService.backwardForward(time).subscribe(console.log);
    }

    selectTutors(contestent, element) {
        this.liveShowService.contestantChoosesTutor(contestent.id, element.value).subscribe(
            () => this.jhiAlertService.success('修改导师成功'),
            ({ error }) => {
                this.jhiAlertService.error(error.message);
                element.value = contestent.tutor && contestent.tutor.login;
            }
        );
    }
}
