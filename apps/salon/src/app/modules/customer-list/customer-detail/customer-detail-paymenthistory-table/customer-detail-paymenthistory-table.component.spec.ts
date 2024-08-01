import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDetailPaymenthistoryTableComponent } from './customer-detail-paymenthistory-table.component';

describe('CustomerDetailPaymenthistoryTableComponent', () => {
  let component: CustomerDetailPaymenthistoryTableComponent;
  let fixture: ComponentFixture<CustomerDetailPaymenthistoryTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerDetailPaymenthistoryTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      CustomerDetailPaymenthistoryTableComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
