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
import { TDSModalModule, TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSNotificationService } from 'tds-ui/notification';
import { InvoiceComponent } from '../../invoice/invoice.component';
import { TDSDropDownModule } from 'tds-ui/dropdown';
import { TDSPipesModule } from 'tds-ui/core/pipes';
import { TDSRadioModule } from 'tds-ui/radio';
import { catchError, concatMap, tap } from 'rxjs';
import { TDSTagModule } from 'tds-ui/tag';
import { TDSToolTipModule } from 'tds-ui/tooltip';

@Component({
  selector: 'frontend-payment-info',
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
    TDSToolTipModule
  ],
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss'],
})
export class PaymentInfoComponent implements OnInit {
  private readonly modalRef = inject(TDSModalRef);
  private readonly tModalSvc = inject(TDSModalService);
  @Input() id?: any;
  @Input() billID?: any;
  infoAppoint: any;
  service: any[] = [];
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

  formatDate(date: string, format: string): string {
    return moment(date).format(format);
  }

  resetTotal() {
    this.total = 0
    for (const num of this.service) {
      this.total += num.totalPrice;
    }
  }

  exit() {
    this.modalRef.destroy();
  }

  onInvoice(billId:any) {
    const modal = this.tModalSvc.create({
      title: 'In hóa đơn',
      content: InvoiceComponent,
      footer: null,
      size: 'xl',
      componentParams: {
        billId
      }
    });
    modal.afterClose.asObservable().subscribe()
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
