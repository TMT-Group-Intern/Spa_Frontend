import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceAppointmentModalComponent } from './service-appointment-modal.component';

describe('ServiceAppointmentModalComponent', () => {
  let component: ServiceAppointmentModalComponent;
  let fixture: ComponentFixture<ServiceAppointmentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceAppointmentModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceAppointmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
