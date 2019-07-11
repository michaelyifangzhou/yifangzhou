import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Contestent } from 'app/shared/model/contestent.model';
import { ContestentService } from './contestent.service';
import { ContestentComponent } from './contestent.component';
import { ContestentDetailComponent } from './contestent-detail.component';
import { ContestentUpdateComponent } from './contestent-update.component';
import { ContestentDeletePopupComponent } from './contestent-delete-dialog.component';
import { IContestent } from 'app/shared/model/contestent.model';

@Injectable({ providedIn: 'root' })
export class ContestentResolve implements Resolve<IContestent> {
    constructor(private service: ContestentService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Contestent> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Contestent>) => response.ok),
                map((contestent: HttpResponse<Contestent>) => contestent.body)
            );
        }
        return of(new Contestent());
    }
}

export const contestentRoute: Routes = [
    {
        path: 'contestent',
        component: ContestentComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Contestents'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'contestent/:id/view',
        component: ContestentDetailComponent,
        resolve: {
            contestent: ContestentResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Contestents'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'contestent/new',
        component: ContestentUpdateComponent,
        resolve: {
            contestent: ContestentResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Contestents'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'contestent/:id/edit',
        component: ContestentUpdateComponent,
        resolve: {
            contestent: ContestentResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Contestents'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const contestentPopupRoute: Routes = [
    {
        path: 'contestent/:id/delete',
        component: ContestentDeletePopupComponent,
        resolve: {
            contestent: ContestentResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Contestents'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
