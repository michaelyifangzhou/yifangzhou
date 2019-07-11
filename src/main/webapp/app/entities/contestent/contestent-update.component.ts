import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

import { IContestent } from 'app/shared/model/contestent.model';
import { ContestentService } from './contestent.service';
import { IUser, UserService } from 'app/core';

@Component({
    selector: 'jhi-contestent-update',
    templateUrl: './contestent-update.component.html'
})
export class ContestentUpdateComponent implements OnInit {
    contestent: IContestent;
    isSaving: boolean;

    users: IUser[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected contestentService: ContestentService,
        protected userService: UserService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ contestent }) => {
            this.contestent = contestent;
        });
        this.userService.query().subscribe(
            (res: HttpResponse<IUser[]>) => {
                this.users = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.contestent.id !== undefined) {
            this.subscribeToSaveResponse(this.contestentService.update(this.contestent));
        } else {
            this.subscribeToSaveResponse(this.contestentService.create(this.contestent));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IContestent>>) {
        result.subscribe((res: HttpResponse<IContestent>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackUserById(index: number, item: IUser) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}
