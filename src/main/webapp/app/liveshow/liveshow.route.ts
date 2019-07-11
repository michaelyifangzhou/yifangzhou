import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { contestantListRoute } from './contestant-list/contestant-list.route';
import { controlPanelRoute } from 'app/liveshow/control-panel/control-panel.route';
import { videoPresentationRoute } from 'app/liveshow/video-presentation/video-presentation.route';

const LIVESHOW_ROUTES = [contestantListRoute, controlPanelRoute, videoPresentationRoute];

export const liveshowState: Routes = [
    {
        path: '',
        data: {
            authorities: []
        },
        canActivate: [UserRouteAccessService],
        children: LIVESHOW_ROUTES
    }
];
