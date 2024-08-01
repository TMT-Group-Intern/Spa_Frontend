import { InvoiceService } from './../../invoice/invoice.service';
import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../shared.service';
import * as moment from 'moment';
import { TDSTableModule } from 'tds-ui/table';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSInputNumberModule } from 'tds-ui/input-number';
import { TDSModalModule, TDSModalRef } from 'tds-ui/modal';
import { TDSNotificationService } from 'tds-ui/notification';
import { InvoiceComponent } from '../../invoice/invoice.component';
import { TDSDropDownModule } from 'tds-ui/dropdown';
import { TDSPipesModule } from 'tds-ui/core/pipes';
import { TDSRadioModule } from 'tds-ui/radio';
import { catchError, concatMap, tap } from 'rxjs';
import { TDSTagModule } from 'tds-ui/tag';

@Component({
  selector: 'frontend-payment-modal',
  standalone: true,
  imports: [
    CommonModule,
    TDSTableModule,
    ReactiveFormsModule,
    TDSFormFieldModule,
    TDSInputModule,
    TDSButtonModule,
    TDSInputNumberModule,
    TDSModalModule,
    TDSDropDownModule,
    FormsModule,
    TDSPipesModule,
    TDSRadioModule,
    TDSTagModule,
  ],
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss'],
})
export class PaymentModalComponent implements OnInit {
  // private readonly tModalSvc = inject(TDSModalService);
  private readonly modalRef = inject(TDSModalRef);
  // routeSub: Subscription | undefined
  // BillID: any;
  @Input() id?: any;
  @Input() billID?: any;
  // inforCus: any;
  infoAppoint: any;
  service: any[] = [];
  // billID: any
  billStatus: any
  kindofDiscount = '%'
  amountDiscount = 0
  total = 0;
  totalAmount = 0
  amountResidual = 0
  amountInvoiced = 0
  note = ''
  amountInvoicedContinue = 0
  amountResidualContinue = 0
  paymentMethod = 'Tiền mặt'
  paymentByBill: any

  constructor(
    // private route: ActivatedRoute,
    private shared: AuthService,
    private notification: TDSNotificationService,
  ) { }

  ngOnInit(): void {
    this.shared.getAppointment(this.id).pipe(
      tap((dataAppoint) => {
        this.infoAppoint = dataAppoint
      }),
      concatMap(() => this.shared.getAllBillByAppointmentID(this.id).pipe(
        tap((dataBill: any) => {
          // this.billID = dataBill.billID
          this.billStatus = dataBill.billStatus
          this.totalAmount = dataBill.totalAmount
          this.amountInvoiced = dataBill.amountInvoiced
          this.amountResidual = this.amountResidualContinue = dataBill.amountResidual
          this.amountDiscount = dataBill.amountDiscount == null ? 0 : dataBill.amountDiscount
          this.kindofDiscount = dataBill.kindofDiscount == null ? '%' : dataBill.kindofDiscount
          this.note = dataBill.note == null ? '' : dataBill.note

          this.service = [...(dataBill.billItems as any[]).map(item => ({
            serviceID: item.serviceID,
            serviceName: item.serviceName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            tempPrice: item.unitPrice * item.quantity,
            totalPrice: item.totalPrice,
            amountDiscount: item.amountDiscount,
            kindofDiscount: item.kindofDiscount,
            note: item.note,
          }))]

          // Calculate total of payment
          this.resetTotal()
        })
      )),
      concatMap(() => this.shared.getPaymentsByBill(this.billID).pipe(
        tap((dataPayment) => {
          this.paymentByBill = dataPayment
        })
      ))
    ).subscribe()
  }

  // Format Date & Time
  formatDate(date: string, format: string): string {
    return moment(date).format(format);
  }

  //
  resetTotal() {
    this.total = 0
    for (const num of this.service) {
      this.total += num.totalPrice;
    }
    // this.totalAmountAfterDiscount()
  }

  //
  updateAmountResidual() {
    this.amountResidualContinue = this.amountResidual - this.amountInvoicedContinue
  }

  createPayment$(billID: number) {

    return this.shared.createPayment({
      billID: billID,
      amount: this.amountInvoicedContinue,
      paymentDate: new Date(),
      paymentMethod: this.paymentMethod
    }).pipe(
      tap((val) => {
        this.createNotificationSuccess('');
        this.modalRef.destroy(val);
      }),
      catchError((res) => {
        this.createNotificationError(res.error.message);
        return res
      })
    )
  }

  //
  exit() {
    this.modalRef.destroy();
  }

  //
  save() {
    for (const ser of this.service) {
      if (ser.kindofDiscount == 'VND' && ser.amountDiscount == 0) {
        ser.kindofDiscount = '%'
      }
    }

    const val = {
      customerID: this.infoAppoint.customerID,
      appointmentID: this.id,
      date: this.infoAppoint.appointmentDate,
      billStatus: "Thanh toán 1 phần",
      doctor: this.infoAppoint.doctor,
      technicalStaff: this.infoAppoint.teachnicalStaff,
      totalAmount: this.totalAmount,
      amountInvoiced: this.amountInvoiced,
      amountResidual: this.amountResidual,
      amountDiscount: this.amountDiscount,
      kindofDiscount: (this.kindofDiscount === 'VND' && this.amountDiscount === 0) ? '%' : this.kindofDiscount,
      note: this.note,
      billItems: this.service
    }

    if (this.amountInvoicedContinue == 0) {
      this.modalRef.destroy(val);
    } else {
      if (this.amountResidualContinue == 0) {
        console.log(this.billID, 1)
        // this.shared.UpdateStatus(this.id, 'Thanh toán hoàn tất').subscribe()
        this.shared.updateBill(this.billID, { ...val, billStatus: "Thanh toán hoàn tất" }).pipe(
          concatMap(() => this.createPayment$(this.billID))
        ).subscribe()
      } else {
        console.log(this.billID, 2)
        // this.shared.UpdateStatus(this.id, 'Thanh toán 1 phần').subscribe()
        this.shared.updateBill(this.billID, { ...val, billStatus: "Thanh toán 1 phần" }).pipe(
          concatMap(() => this.createPayment$(this.billID))
        ).subscribe()
      }
      // this.createPayment$(this.billID).subscribe()
    }
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
