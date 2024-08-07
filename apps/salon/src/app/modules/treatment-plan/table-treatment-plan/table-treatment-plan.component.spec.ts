import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableTreatmentPlanComponent } from './table-treatment-plan.component';

describe('TableTreatmentPlanComponent', () => {
  let component: TableTreatmentPlanComponent;
  let fixture: ComponentFixture<TableTreatmentPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableTreatmentPlanComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableTreatmentPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
