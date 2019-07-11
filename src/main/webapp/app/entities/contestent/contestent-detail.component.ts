import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IContestent } from 'app/shared/model/contestent.model';

@Component({
    selector: 'jhi-contestent-detail',
    templateUrl: './contestent-detail.component.html'
})
export class ContestentDetailComponent implements OnInit {
    contestent: IContestent;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ contestent }) => {
            this.contestent = contestent;
        });
    }

    previousState() {
        window.history.back();
    }
}
