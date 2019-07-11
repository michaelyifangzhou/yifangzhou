/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { LiveshowTestModule } from '../../../test.module';
import { ContestentUpdateComponent } from 'app/entities/contestent/contestent-update.component';
import { ContestentService } from 'app/entities/contestent/contestent.service';
import { Contestent } from 'app/shared/model/contestent.model';

describe('Component Tests', () => {
    describe('Contestent Management Update Component', () => {
        let comp: ContestentUpdateComponent;
        let fixture: ComponentFixture<ContestentUpdateComponent>;
        let service: ContestentService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [LiveshowTestModule],
                declarations: [ContestentUpdateComponent]
            })
                .overrideTemplate(ContestentUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ContestentUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ContestentService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new Contestent(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.contestent = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new Contestent();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.contestent = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.create).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));
        });
    });
});
