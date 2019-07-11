/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LiveshowTestModule } from '../../../test.module';
import { ContestentDetailComponent } from 'app/entities/contestent/contestent-detail.component';
import { Contestent } from 'app/shared/model/contestent.model';

describe('Component Tests', () => {
    describe('Contestent Management Detail Component', () => {
        let comp: ContestentDetailComponent;
        let fixture: ComponentFixture<ContestentDetailComponent>;
        const route = ({ data: of({ contestent: new Contestent(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [LiveshowTestModule],
                declarations: [ContestentDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(ContestentDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ContestentDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.contestent).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
