import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { LiveshowContestentModule } from './contestent/contestent.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    // prettier-ignore
    imports: [
        LiveshowContestentModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LiveshowEntityModule {}
