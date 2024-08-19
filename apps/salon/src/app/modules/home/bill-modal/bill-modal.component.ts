import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSTableModule } from 'tds-ui/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSInputNumberModule } from 'tds-ui/input-number';
import { TDSModalModule, TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSDropDownModule } from 'tds-ui/dropdown';
import { TDSPipesModule } from 'tds-ui/core/pipes';
import { AuthService } from '../../../shared.service';
import { TDSNotificationService } from 'tds-ui/notification';
import * as moment from 'moment';
import { TDSRadioModule } from 'tds-ui/radio';
import { catchError, concatMap, filter, tap } from 'rxjs';
import { InvoiceComponent } from '../../invoice/invoice.component';

@Component({
  selector: 'frontend-bill-modal',
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
  ],
  templateUrl: './bill-modal.component.html',
  styleUrls: ['./bill-modal.component.scss'],
})
export class BillModalComponent {
  private readonly tModalSvc = inject(TDSModalService);
  private readonly modalRef = inject(TDSModalRef);
  // routeSub: Subscription | undefined
  // BillID: any;
  @Input() id?: any;
  // inforCus: any;
  infoAppoint: any;
  service: any[] = [];
  treatment: any[] = [];
  billID = null
  kindofDiscount = '%'
  amountDiscount = 0
  total = 0;
  totalAmount = 0
  amountResidual = 0
  amountInvoiced = 0
  note = ''
  paymentMethod = 'Tiền mặt'

  constructor(
    private shared: AuthService,
    private notification: TDSNotificationService,
  ) { }

  ngOnInit(): void {
    this.shared.getAppointment(this.id).subscribe(
      (data: any) => {
        this.infoAppoint = data

        console.log(this.infoAppoint)

        this.service = [...(data.chooseServices as any[]).map(item => ({
          serviceID: item.serviceID,
          serviceName: item.service.serviceName,
          quantity: 1,
          unitPrice: item.service.price,
          tempPrice: item.service.price,
          totalPrice: item.service.price,
          amountDiscount: 0,
          kindofDiscount: '%',
          note: '',
          isTreatment: false
        }))]

        this.treatment = [...(data.chooseServiceTreatments as any[]).map(item => ({
          serviceID: item.treatmentDetail.serviceID,
          serviceName: item.treatmentDetail.service.serviceName,
          quantity: item.qualityChooses,
          unitPrice: item.treatmentDetail.price / item.treatmentDetail.quantity,
          totalPrice: item.treatmentDetail.price / item.treatmentDetail.quantity,
          amountDiscount: 0,
          kindofDiscount: '%',
          note: '',
          isTreatment: true
        }))]

        // Calculate total of payment
        this.resetTotal()
      });


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
    for (const num of this.treatment) {
      this.total += num.totalPrice;
    }
    this.totalAmountAfterDiscount()
  }

  // Calculate the total after use discount
  totalAmountAfterDiscount() {
    if (this.kindofDiscount == '%') {
      this.totalAmount = this.total * (100 - this.amountDiscount) / 100;
      this.amountResidual = this.totalAmount - this.amountInvoiced
    } else {
      this.totalAmount = this.total - this.amountDiscount;
      this.amountResidual = this.totalAmount - this.amountInvoiced
    }
  }

  // Calculate Total Price
  totalPrice(id: number) {
    const service = this.service.find(ser => ser.serviceID === id);
    service.tempPrice = service.unitPrice * service.quantity
    this.priceAfterDiscount(id)
  }

  // Calculate the price after use discount
  priceAfterDiscount(id: number) {
    const service = this.service.find(ser => ser.serviceID === id);
    if (service.kindofDiscount == '%') {
      service.totalPrice = service.tempPrice * (100 - service.amountDiscount) / 100;
    } else {
      service.totalPrice = service.tempPrice - service.amountDiscount;
    }
    this.resetTotal()
  }

  //
  activeDiscountPercentagePrice(id: number) {
    const service = this.service.find(ser => ser.serviceID === id);
    service.kindofDiscount = '%'
    service.amountDiscount = 0
    service.totalPrice = service.tempPrice
    this.resetTotal()
  }

  //
  activeDiscountVNDPrice(id: number) {
    const service = this.service.find(ser => ser.serviceID === id);
    service.kindofDiscount = 'VND'
    service.amountDiscount = 0
    service.totalPrice = service.tempPrice
    this.resetTotal()
  }

  activeDiscountPercentage() {
    this.kindofDiscount = '%'
    this.amountDiscount = 0
    this.totalAmountAfterDiscount()
  }

  activeDiscountVND() {
    this.kindofDiscount = 'VND'
    this.amountDiscount = 0
    this.totalAmountAfterDiscount()
  }

  createPayment$(billID: number) {

    return this.shared.createPayment({
      billID: billID,
      amount: this.amountInvoiced,
      paymentDate: new Date(),
      paymentMethod: this.paymentMethod
    }).pipe(
      tap((val) => {
        this.createNotificationSuccess('');
        const modal = this.tModalSvc.confirm({
          title: 'In hóa đơn',
          content: `<h5 class="text-success-500">Bạn có muốn in hóa đơn không?</h5>`,
          iconType: 'tdsi-print-fill',
          okText: 'In hóa đơn',
          size: 'sm',
          cancelText: 'Hủy',
          onOk: () => true
        });
        modal.afterClose.asObservable().pipe(
          filter(condition => condition),
          tap(() => this.onInvoice(billID))
        ).subscribe();
        this.modalRef.destroy(val);
      }),
      catchError((res) => {
        this.createNotificationError(res.error.message);
        return res
      })
    )
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
      billStatus: "Chưa thanh toán",
      doctor: this.infoAppoint.doctor,
      technicalStaff: this.infoAppoint.teachnicalStaff,
      totalAmount: this.totalAmount,
      amountInvoiced: 0,
      amountResidual: this.amountResidual,
      amountDiscount: this.amountDiscount,
      kindofDiscount: (this.kindofDiscount === 'VND' && this.amountDiscount === 0) ? '%' : this.kindofDiscount,
      note: this.note,
      billItems: [...this.service, ...this.treatment],
    }

    // console.log(val.billItems)

    if (this.amountInvoiced == 0) {
      this.shared.createBill(val).subscribe()
      this.modalRef.destroy(val);
    } else {
      if (this.amountResidual == 0) {
        this.shared.createBill({ ...val, billStatus: "Thanh toán hoàn tất" }).pipe(
          concatMap(() => this.shared.getAllBillByAppointmentID(this.id)),
          concatMap((data) => this.createPayment$(data.billID))
        ).subscribe()
      } else {
        this.shared.createBill({ ...val, billStatus: "Thanh toán 1 phần" }).pipe(
          concatMap(() => this.shared.getAllBillByAppointmentID(this.id)),
          concatMap((data) => this.createPayment$(data.billID))
        ).subscribe()
      }
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
