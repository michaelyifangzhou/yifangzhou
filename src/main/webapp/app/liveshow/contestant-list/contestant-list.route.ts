import { Route } from '@angular/router';
import { ContestantListComponent } from 'app/liveshow/contestant-list/contestant-list.component';

export const contestantListRoute: Route = {
    path: 'list',
    component: ContestantListComponent,
    data: {
        pageTitle: '主播列表'
    }
};
