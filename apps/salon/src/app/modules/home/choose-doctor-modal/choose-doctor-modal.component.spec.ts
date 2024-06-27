import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseDoctorModalComponent } from './choose-doctor-modal.component';

describe('ChooseDoctorModalComponent', () => {
  let component: ChooseDoctorModalComponent;
  let fixture: ComponentFixture<ChooseDoctorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseDoctorModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChooseDoctorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
