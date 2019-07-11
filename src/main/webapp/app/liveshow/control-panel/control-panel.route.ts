import { Route } from '@angular/router';
import { ControlPanelComponent } from './control-panel.component';
import { UserRouteAccessService } from 'app/core';

export const controlPanelRoute: Route = {
    path: 'control',
    component: ControlPanelComponent,
    data: {
        authorities: ['ROLE_ADMIN'],
        pageTitle: '控制面板'
    },
    canActivate: [UserRouteAccessService]
};
