import { NgModule } from '@angular/core';

import { VideoPresentationComponent } from './video-presentation/video-presentation.component';
import { ContestantListComponent } from './contestant-list/contestant-list.component';
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { RouterModule } from '@angular/router';
import { liveshowState } from 'app/liveshow/liveshow.route';
import { LiveViewComponent } from './video-presentation/live-view/live-view.component';
import { TutorViewComponent } from './video-presentation/tutor-view/tutor-view.component';
import { LiveshowSharedModule } from 'app/shared';

@NgModule({
    declarations: [VideoPresentationComponent, ContestantListComponent, ControlPanelComponent, LiveViewComponent, TutorViewComponent],
    imports: [LiveshowSharedModule, RouterModule.forChild(liveshowState)]
})
export class LiveshowModule {}
