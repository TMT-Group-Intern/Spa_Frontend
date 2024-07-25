import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSTableModule } from 'tds-ui/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSInputNumberModule } from 'tds-ui/input-number';
import { TDSModalModule, TDSModalRef } from 'tds-ui/modal';
import { TDSDropDownModule } from 'tds-ui/dropdown';
import { TDSPipesModule } from 'tds-ui/core/pipes';
import { AuthService } from '../../../shared.service';
import { TDSNotificationService } from 'tds-ui/notification';
import * as moment from 'moment';

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
  ],
  templateUrl: './bill-modal.component.html',
  styleUrls: ['./bill-modal.component.scss'],
})
export class BillModalComponent {
  // private readonly tModalSvc = inject(TDSModalService);
  private readonly modalRef = inject(TDSModalRef);
  // routeSub: Subscription | undefined
  // BillID: any;
  @Input() id?: any;
  // inforCus: any;
  infoAppoint: any;
  service: any[] = [];
  billID = null
  kindofDiscount = '%'
  amountDiscount = 0
  total = 0;
  totalAmount = 0
  amountResidual = 0
  amountInvoiced = 0
  note = ''

  constructor(
    // private route: ActivatedRoute,
    private shared: AuthService,
    private notification: TDSNotificationService,
  ) { }

  ngOnInit(): void {
    this.shared.getAppointment(this.id).subscribe(
      (data: any) => {
        this.infoAppoint = data

        this.shared.getAllBillByAppointmentID(this.id).subscribe(
          (dataBill: any) => {
            if (dataBill == null) {
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
              }))]

              // Calculate total of payment
              this.resetTotal()
            } else {
              this.billID = dataBill.billID
              this.totalAmount = dataBill.totalAmount
              this.amountInvoiced = dataBill.amountInvoiced
              this.amountResidual = dataBill.amountResidual
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
            }
          }
        )
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

  updateStatus() {
    console.log(this.id)

  }

  //
  save() {
    const val = {
      customerID: this.infoAppoint.customerID,
      appointmentID: this.id,
      date: this.infoAppoint.appointmentDate,
      // billStatus: "string",
      doctor: this.infoAppoint.doctor,
      technicalStaff: this.infoAppoint.teachnicalStaff,
      totalAmount: this.totalAmount,
      amountInvoiced: this.amountInvoiced,
      amountResidual: this.amountResidual,
      amountDiscount: this.amountDiscount,
      kindofDiscount: this.kindofDiscount,
      note: this.note,
      billItems: this.service
    }

    if (this.amountInvoiced == 0) {
      this.shared.UpdateStatus(this.id, 'Chưa thanh toán').subscribe()
    } else {
      if (this.amountResidual != 0) {
        this.shared.UpdateStatus(this.id, 'Thanh toán 1 phần').subscribe()
      } else {
        this.shared.UpdateStatus(this.id, 'Thanh toán hoàn tất').subscribe()
      }
    }

    if (this.billID) {
      this.shared.updateBill(this.billID, val).subscribe(
        () => {
          this.createNotificationSuccess('');
          this.modalRef.destroy(val);
        },
        (res) => {
          this.createNotificationError(res.error.message);
        }
      )
    } else {
      this.shared.createBill(val).subscribe(
        () => {
          this.createNotificationSuccess('');
          this.modalRef.destroy(val);
        },
        (res) => {
          this.createNotificationError(res.error.message);
        }
      )
      console.log(val)
    }
  }

  // onEditPayment() {
  //   const modal = this.tModalSvc.create({
  //     title: 'Thanh Toán',
  //     content: PaymentModalComponent,
  //     footer: null,
  //     size: 'lg',
  //     style: { outerHeight: 500 },
  //     componentParams: {
  //       billID: this.BillID,
  //       infoBill: this.infoBill
  //     },
  //   });
  //   modal.afterClose.asObservable().subscribe((res) => {
  //     if (res) {
  //       this.ngOnInit();
  //     }
  //   });
  // }


  // //
  // submit() {
  //   this.shared.createPayment(this.BillID, '').subscribe(
  //     () => {
  //       this.createNotificationSuccess('');
  //       // this.modalRef.destroy(this.id);
  //     },
  //     (res) => {
  //       this.createNotificationError(res.error.message);
  //     }
  //   )
  // }

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
