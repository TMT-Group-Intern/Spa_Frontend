import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSBreadCrumbModule } from 'tds-ui/breadcrumb';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { AuthService } from '../../shared.service';
import { th } from 'date-fns/locale';
import { TDSTableModule } from 'tds-ui/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSInputNumberModule } from 'tds-ui/input-number';
import { TDSModalModule } from 'tds-ui/modal';
import { TDSDropDownModule } from 'tds-ui/dropdown';
import { TDSPipesModule } from 'tds-ui/core/pipes';
import * as moment from 'moment';
import { TDSNotificationService } from 'tds-ui/notification';

@Component({
  selector: 'frontend-bill',
  standalone: true,
  imports: [
    CommonModule,
    TDSBreadCrumbModule,
    RouterLink,
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
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss'],
})
export class BillComponent implements OnInit {

  routeSub: Subscription | undefined
  BillID: any;
  inforCus: any;
  infoBill: any;
  service: any[] = [];
  total = 0;

  discountTotal = 0

  isPercentageActive = true
  isPercentageInactive = false
  isVNDActive = false
  isVNDInactive = true

  constructor(
    private route: ActivatedRoute,
    private shared: AuthService,
    private notification: TDSNotificationService,
  ) { }

  ngOnInit(): void {
    this.routeSub = this.route.params.pipe(
      switchMap(params => this.shared.getBill(params['id']))
    ).subscribe(
      (data: any) => {

        this.shared.getCustomer(data.CustomerID).subscribe(
          (dataCustomer: any) => {
            this.inforCus = dataCustomer.customerDTO
          }
        )

        this.BillID = data.BillID
        this.infoBill = data
        console.log(data.BillItems);

        this.service = [...(data.BillItems as any[]).map(item => ({
          ServiceID: item.ServiceID,
          ServiceName: item.ServiceName,
          Quantity: item.Quantity != null ? item.Quantity : 1,
          UnitPrice: item.UnitPrice,
          TotalPrice: item.TotalPrice,
          AmountDiscount: item.AmountDiscount != null ? item.AmountDiscount : 0,
          KindofDiscount: item.KindofDiscount != null ? item.KindofDiscount : '%',
          FinalPrice: item.TotalPrice,
          Note: item.Note,
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
      this.total += num.FinalPrice;
    }
    this.totalAmountAfterDiscount()
  }

  // Calculate the total after use discount
  totalAmountAfterDiscount() {
    if (this.isPercentageActive) {
      this.infoBill.TotalAmount = this.infoBill.AmountResidual = this.total * (100 - this.discountTotal) / 100;
    } else {
      this.infoBill.TotalAmount = this.infoBill.AmountResidual = this.total - this.discountTotal;
    }
  }

  // Calculate Total Price
  totalPrice(id: number) {
    const service = this.service.find(ser => ser.ServiceID === id);
    service.TotalPrice = service.UnitPrice * service.Quantity
    this.priceAfterDiscount(id)
  }

  // Calculate the price after use discount
  priceAfterDiscount(id: number) {
    const service = this.service.find(ser => ser.ServiceID === id);
    if (service.KindofDiscount == '%') {
      service.FinalPrice = service.TotalPrice * (100 - service.AmountDiscount) / 100;
    } else {
      service.FinalPrice = service.TotalPrice - service.AmountDiscount;
    }
    this.resetTotal()
  }

  //
  activeDiscountPercentagePrice(id: number) {
    const service = this.service.find(ser => ser.ServiceID === id);
    service.KindofDiscount = '%'
    service.AmountDiscount = 0
    service.FinalPrice = service.TotalPrice
    this.resetTotal()
  }

  //
  activeDiscountVNDPrice(id: number) {
    const service = this.service.find(ser => ser.ServiceID === id);
    service.KindofDiscount = 'VND'
    service.AmountDiscount = 0
    service.FinalPrice = service.TotalPrice
    this.resetTotal()
  }

  activeDiscountPercentage() {
    this.isPercentageActive = true
    this.isPercentageInactive = false
    this.isVNDActive = false
    this.isVNDInactive = true
    this.discountTotal = 0
    this.infoBill.TotalAmount = this.total

  }

  activeDiscountVND() {
    this.isPercentageActive = false
    this.isPercentageInactive = true
    this.isVNDActive = true
    this.isVNDInactive = false
    this.discountTotal = 0
    this.infoBill.TotalAmount = this.total
  }

  //
  save() {
    const val = {
      customerID: this.infoBill.CustomerID,
      appointmentID: this.infoBill.AppointmentID,
      date: this.infoBill.Date,
      billStatus: this.infoBill.BillStatus,
      doctor: this.infoBill.Doctor,
      technicalStaff: this.infoBill.TechnicalStaff,
      totalAmount: this.infoBill.TotalAmount,
      amountInvoiced: this.infoBill.AmountInvoiced,
      amountResidual: this.infoBill.AmountResidual,
      billItems: this.service
    }

    console.log(this.service)

    this.shared.updateBill(this.BillID, val).subscribe(
      () => {
        this.createNotificationSuccess('');
      },
      (res) => {
        this.createNotificationError(res.error.message);
      }
    )
  }

  //
  submit() {
    this.shared.createPayment(this.BillID, '').subscribe(
      () => {
        this.createNotificationSuccess('');
        // this.modalRef.destroy(this.id);
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
