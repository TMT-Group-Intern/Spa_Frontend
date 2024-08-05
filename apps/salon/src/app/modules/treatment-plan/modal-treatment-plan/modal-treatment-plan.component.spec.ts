import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTreatmentPlanComponent } from './modal-treatment-plan.component';

describe('ModalTreatmentPlanComponent', () => {
  let component: ModalTreatmentPlanComponent;
  let fixture: ComponentFixture<ModalTreatmentPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalTreatmentPlanComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalTreatmentPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
