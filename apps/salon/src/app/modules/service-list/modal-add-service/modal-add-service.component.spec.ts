import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddServiceComponent } from './modal-add-service.component';

describe('ModalAddServiceComponent', () => {
  let component: ModalAddServiceComponent;
  let fixture: ComponentFixture<ModalAddServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalAddServiceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalAddServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
