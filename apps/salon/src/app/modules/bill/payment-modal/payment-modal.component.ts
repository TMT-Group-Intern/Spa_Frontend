import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../shared.service';
import { TDSNotificationService } from 'tds-ui/notification';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSInputNumberModule } from 'tds-ui/input-number';
import { TDSModalModule, TDSModalRef } from 'tds-ui/modal';
import { TDSPipesModule } from 'tds-ui/core/pipes';
import { TDSRadioModule } from 'tds-ui/radio';
import { TDSDatePickerModule } from 'tds-ui/date-picker';
import { AnyARecord } from 'dns';
import { TDSQRCodeModule } from 'tds-ui/qr-code';

@Component({
  selector: 'frontend-payment-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TDSFormFieldModule,
    TDSInputModule,
    TDSButtonModule,
    TDSDatePickerModule,
    TDSInputNumberModule,
    TDSModalModule,
    FormsModule,
    TDSPipesModule,
    TDSRadioModule,
    TDSQRCodeModule,
  ],
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss'],
})
export class PaymentModalComponent implements OnInit{

  private readonly modalRef = inject(TDSModalRef);
  @Input() billID?: number
  @Input() infoBill?: any

  amountResidual: any
  form = inject(FormBuilder).nonNullable.group({
    billID: [0],
    amount: [0],
    paymentDate: [new Date()],
    paymentMethod: ['Tiền mặt'],
    notes: [''],
  });

  constructor (
    private shared: AuthService,
    private notification: TDSNotificationService,
  ){}

  ngOnInit(): void {
    // this.form.get('billID')?.disable();
    // this.form.get('paymentDate')?.disable();
    this.amountResidual = this.infoBill.AmountResidual
    this.form.patchValue({
      billID: this.billID
    })
  }

  //
  updateAmountResidual() {
    this.amountResidual = this.infoBill.AmountResidual - (this.form.value.amount as number)
  }

  //
  submit() {
    this.shared.createPayment(this.form.value).subscribe(
      () => {
        this.createNotificationSuccess('');
        this.modalRef.destroy(this.form.value);
      },
      (res) => {
        this.createNotificationError(res.error.message);
      }
    )
  }

  // Success Notification
  createNotificationSuccess(content: any): void {
    this.notification.success(
      'Succesfully', content
    );
  }

  // Error Notification
  createNotificationError(content: any): void {
    this.notification.error(
      'Error', content
    );
  }

}
