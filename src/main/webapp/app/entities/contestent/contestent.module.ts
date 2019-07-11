import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LiveshowSharedModule } from 'app/shared';
import { LiveshowAdminModule } from 'app/admin/admin.module';
import {
    ContestentComponent,
    ContestentDetailComponent,
    ContestentUpdateComponent,
    ContestentDeletePopupComponent,
    ContestentDeleteDialogComponent,
    contestentRoute,
    contestentPopupRoute
} from './';

const ENTITY_STATES = [...contestentRoute, ...contestentPopupRoute];

@NgModule({
    imports: [LiveshowSharedModule, LiveshowAdminModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ContestentComponent,
        ContestentDetailComponent,
        ContestentUpdateComponent,
        ContestentDeleteDialogComponent,
        ContestentDeletePopupComponent
    ],
    entryComponents: [ContestentComponent, ContestentUpdateComponent, ContestentDeleteDialogComponent, ContestentDeletePopupComponent],
    exports: [ContestentComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LiveshowContestentModule {}
