import './vendor.ts';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { Ng2Webstorage } from 'ngx-webstorage';
import { JhiModuleConfig, NgJhipsterModule } from 'ng-jhipster';

import { AuthInterceptor } from './blocks/interceptor/auth.interceptor';
import { AuthExpiredInterceptor } from './blocks/interceptor/auth-expired.interceptor';
import { ErrorHandlerInterceptor } from './blocks/interceptor/errorhandler.interceptor';
import { NotificationInterceptor } from './blocks/interceptor/notification.interceptor';
import { LiveshowSharedModule } from 'app/shared';
import { LiveshowCoreModule } from 'app/core';
import { LiveshowAppRoutingModule } from './app-routing.module';
import { LiveshowHomeModule } from './home/home.module';
import { LiveshowAccountModule } from './account/account.module';
import { LiveshowEntityModule } from './entities/entity.module';
import * as moment from 'moment';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { ErrorComponent, JhiMainComponent, NavbarComponent, PageRibbonComponent } from './layouts';
import { LiveshowModule } from './liveshow/liveshow.module';

@NgModule({
    imports: [
        BrowserModule,
        LiveshowAppRoutingModule,
        Ng2Webstorage.forRoot({ prefix: 'jhi', separator: '-' }),
        NgJhipsterModule.forRoot({
            // set below to true to make alerts look like toast
            alertAsToast: false,
            alertTimeout: 5000
        }),
        LiveshowSharedModule.forRoot(),
        LiveshowCoreModule,
        LiveshowHomeModule,
        LiveshowAccountModule,
        // jhipster-needle-angular-add-module JHipster will add new module here
        LiveshowEntityModule,
        LiveshowModule
    ],
    declarations: [JhiMainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthExpiredInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorHandlerInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: NotificationInterceptor,
            multi: true
        }
    ],
    bootstrap: [JhiMainComponent]
})
export class LiveshowAppModule {
    constructor(private dpConfig: NgbDatepickerConfig, private moduleConfig: JhiModuleConfig) {
        this.dpConfig.minDate = { year: moment().year() - 100, month: 1, day: 1 };
        this.moduleConfig.alertAsToast = true;
    }
}
