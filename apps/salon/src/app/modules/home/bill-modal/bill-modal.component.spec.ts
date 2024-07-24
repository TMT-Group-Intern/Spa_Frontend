import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillModalComponent } from './bill-modal.component';

describe('BillModalComponent', () => {
  let component: BillModalComponent;
  let fixture: ComponentFixture<BillModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BillModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
