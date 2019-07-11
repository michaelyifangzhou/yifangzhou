/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { LiveshowTestModule } from '../../../test.module';
import { ContestentDeleteDialogComponent } from 'app/entities/contestent/contestent-delete-dialog.component';
import { ContestentService } from 'app/entities/contestent/contestent.service';

describe('Component Tests', () => {
    describe('Contestent Management Delete Component', () => {
        let comp: ContestentDeleteDialogComponent;
        let fixture: ComponentFixture<ContestentDeleteDialogComponent>;
        let service: ContestentService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [LiveshowTestModule],
                declarations: [ContestentDeleteDialogComponent]
            })
                .overrideTemplate(ContestentDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ContestentDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ContestentService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
