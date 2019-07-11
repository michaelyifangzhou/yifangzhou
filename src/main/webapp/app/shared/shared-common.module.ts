import { NgModule } from '@angular/core';

import { LiveshowSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent } from './';

@NgModule({
    imports: [LiveshowSharedLibsModule],
    declarations: [JhiAlertComponent, JhiAlertErrorComponent],
    exports: [LiveshowSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent]
})
export class LiveshowSharedCommonModule {}
