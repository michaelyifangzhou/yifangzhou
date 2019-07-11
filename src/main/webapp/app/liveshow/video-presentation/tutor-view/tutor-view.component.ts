import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService, IUser } from 'app/core';
import { JhiEventManager } from 'ng-jhipster';
import { IContestantCountInfo, ITutorWantInfo } from 'app/liveshow/vm.model';
import { LiveShowService } from 'app/liveshow/live-show.service';

@Component({
    selector: 'bsb-tutor-view',
    templateUrl: './tutor-view.component.html',
    styleUrls: ['./tutor-view.component.scss']
})
export class TutorViewComponent implements OnInit, OnDestroy {
    account: IUser = {};
    contestantCounts = [];
    didTutorChoseContestant = false;

    constructor(private accountService: AccountService, private eventManager: JhiEventManager, private liveshowService: LiveShowService) {}

    ngOnInit() {
        this.accountService.identity().then(account => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();
        document.body.classList.add('background');
    }

    ngOnDestroy() {
        document.body.classList.remove('background');
    }

    private registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', () => {
            this.accountService.identity().then(account => {
                this.account = account;
            });
        });
    }

    public onContestantCountInfo({ counts }: IContestantCountInfo) {
        this.contestantCounts = Array(counts[this.account.id]);
    }

    public onTutorWantInfo({ chosens }: ITutorWantInfo) {
        this.didTutorChoseContestant = chosens[this.account.id];
    }

    choseContestant() {
        this.liveshowService.tutorChoseContestant().subscribe(console.log, console.log);
    }
}
