import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDelServiceComponent } from './modal-del-service.component';

describe('ModalDelServiceComponent', () => {
  let component: ModalDelServiceComponent;
  let fixture: ComponentFixture<ModalDelServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalDelServiceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalDelServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
