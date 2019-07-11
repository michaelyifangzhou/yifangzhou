import { Route } from '@angular/router';
import { VideoPresentationComponent } from './video-presentation.component';

export const videoPresentationRoute: Route = {
    path: 'video',
    component: VideoPresentationComponent,
    data: {
        pageTitle: '展示页'
    }
};
