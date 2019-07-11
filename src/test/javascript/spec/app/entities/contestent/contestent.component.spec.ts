/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { LiveshowTestModule } from '../../../test.module';
import { ContestentComponent } from 'app/entities/contestent/contestent.component';
import { ContestentService } from 'app/entities/contestent/contestent.service';
import { Contestent } from 'app/shared/model/contestent.model';

describe('Component Tests', () => {
    describe('Contestent Management Component', () => {
        let comp: ContestentComponent;
        let fixture: ComponentFixture<ContestentComponent>;
        let service: ContestentService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [LiveshowTestModule],
                declarations: [ContestentComponent],
                providers: []
            })
                .overrideTemplate(ContestentComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ContestentComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ContestentService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Contestent(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.contestents[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
