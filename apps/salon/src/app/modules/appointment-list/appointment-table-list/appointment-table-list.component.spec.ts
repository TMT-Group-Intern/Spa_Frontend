import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentTableListComponent } from './appointment-table-list.component';

describe('AppointmentTableListComponent', () => {
  let component: AppointmentTableListComponent;
  let fixture: ComponentFixture<AppointmentTableListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppointmentTableListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentTableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
