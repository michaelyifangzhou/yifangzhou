import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IContestent } from 'app/shared/model/contestent.model';
import { AccountService } from 'app/core';
import { ContestentService } from './contestent.service';

@Component({
    selector: 'jhi-contestent',
    templateUrl: './contestent.component.html'
})
export class ContestentComponent implements OnInit, OnDestroy {
    contestents: IContestent[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected contestentService: ContestentService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.contestentService.query().subscribe(
            (res: HttpResponse<IContestent[]>) => {
                this.contestents = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInContestents();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IContestent) {
        return item.id;
    }

    registerChangeInContestents() {
        this.eventSubscriber = this.eventManager.subscribe('contestentListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
