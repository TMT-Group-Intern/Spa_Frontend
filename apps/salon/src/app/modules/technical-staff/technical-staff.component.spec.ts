import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalStaffComponent } from './technical-staff.component';

describe('TechnicalStaffComponent', () => {
  let component: TechnicalStaffComponent;
  let fixture: ComponentFixture<TechnicalStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechnicalStaffComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TechnicalStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
