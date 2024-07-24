import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSTableModule } from 'tds-ui/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSInputNumberModule } from 'tds-ui/input-number';
import { TDSModalModule } from 'tds-ui/modal';
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
  // routeSub: Subscription | undefined
  // BillID: any;
  @Input() id?: any;
  inforCus: any;
  infoAppoint: any;
  service: any[] = [];
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

        this.shared.getCustomer(data.customerID).subscribe(
          (dataCustomer: any) => {
            this.inforCus = dataCustomer.item
          }
        )

        // this.BillID = data.BillID
        this.infoAppoint = data
        console.log(this.infoAppoint);

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
      this.totalAmount = this.totalAmount - this.amountInvoiced
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

  //
  save() {
    // const val = {
    //   customerID: this.infoBill.CustomerID,
    //   appointmentID: this.infoBill.AppointmentID,
    //   date: this.infoBill.Date,
    //   billStatus: this.infoBill.BillStatus,
    //   doctor: this.infoBill.Doctor,
    //   technicalStaff: this.infoBill.TechnicalStaff,
    //   totalAmount: this.infoBill.TotalAmount,
    //   amountInvoiced: this.infoBill.AmountInvoiced,
    //   amountResidual: this.infoBill.AmountResidual,
    //   amountDiscount: this.infoBill.AmountDiscount,
    //   kindofDiscount: this.infoBill.KindofDiscount,
    //   note: this.infoBill.Note,
    //   billItems: this.service
    // }

    // this.shared.updateBill(this.BillID, val).subscribe(
    //   () => {
    //     this.createNotificationSuccess('');
    //   },
    //   (res) => {
    //     this.createNotificationError(res.error.message);
    //   }
    // )
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
