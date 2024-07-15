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
  ],
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss'],
})
export class PaymentModalComponent implements OnInit {

  private readonly modalRef = inject(TDSModalRef);
  @Input() id?: number
  inforCus: any;
  service: any[] = [];

  total = 0;
  totalAmount: any;
  createAppointmentForm!: FormGroup;

  discountPercentage = 0
  discountVND = 0

  isPercentageActive = true
  isPercentageInactive = false
  isVNDActive = false
  isVNDInactive = true

  constructor(
    private shared: AuthService,
    private notification: TDSNotificationService,
    private invoiceSvc: InvoiceService
  ) { }

  ngOnInit(): void {

    if (this.id) {
      this.shared.getAppointment(this.id).subscribe(
        (data: any) => {
          console.log(data)

          this.inforCus = data;
          this.service = [...(data.ChooseServices as any[]).map(item => ({
            id: item.service.ServiceID,
            code: item.service.ServiceCode,
            name: item.service.ServiceName,
            price: item.service.Price,
            discount: 0,
            finalPrice: item.service.Price,
            isPercentagePriceActive: true,
            isPercentagePriceInactive: false,
            isVNDPriceActive: false,
            isVNDPriceInactive: true,
          }))]

          // Calculate total of payment
          this.resetTotal()
        }
      )
    }

  }

  //
  resetTotal() {
    this.total = 0
    for (const num of this.service) {
      this.total += num.finalPrice;
    }
    this.totalAmountAfterDiscount()
  }

  activeDiscountPercentage() {
    this.isPercentageActive = true
    this.isPercentageInactive = false
    this.isVNDActive = false
    this.isVNDInactive = true
    this.discountPercentage = 0
    this.totalAmount = this.total
  }

  activeDiscountVND() {
    this.isPercentageActive = false
    this.isPercentageInactive = true
    this.isVNDActive = true
    this.isVNDInactive = false
    this.discountVND = 0
    this.totalAmount = this.total
  }

  activeDiscountPercentagePrice(id: number) {
    const service = this.service.find(ser => ser.id === id);
    service.isPercentagePriceActive = true
    service.isPercentagePriceInactive = false
    service.isVNDPriceActive = false
    service.isVNDPriceInactive = true
    service.discount = 0
    service.finalPrice = service.price
    this.resetTotal()
  }

  activeDiscountVNDPrice(id: number) {
    const service = this.service.find(ser => ser.id === id);
    service.isPercentagePriceActive = false
    service.isPercentagePriceInactive = true
    service.isVNDPriceActive = true
    service.isVNDPriceInactive = false
    service.discount = 0
    service.finalPrice = service.price
    this.resetTotal()
  }

  // Format Date & Time
  formatDate(date: string, format: string): string {
    return moment(date).format(format);
  }

  // Calculate the price after use discount
  priceAfterDiscount(id: number) {
    const service = this.service.find(ser => ser.id === id);
    if (service.isPercentagePriceActive) {
      // service.discount = this.discountPrice.value.discountPercentage
      service.finalPrice = service.price * (100 - service.discount) / 100;
    } else {
      // service.discount = this.discountPrice.value.discountVND
      service.finalPrice = service.price - service.discount;
    }
    this.resetTotal()
  }

  // Calculate the total after use discount
  totalAmountAfterDiscount() {
    if (this.isPercentageActive) {
      this.totalAmount = this.total * (100 - this.discountPercentage) / 100;
    } else {
      this.totalAmount = this.total - this.discountVND;
    }
  }

  submit() {
    this.shared.createPayment(this.id, '').subscribe(
      () => {
        this.createNotificationSuccess('');
        this.modalRef.destroy(this.id);
      },
      (res) => {
        this.createNotificationError(res.error.message);
      }
    )
  }

  invoice() {
    console.log(1)
    // this.invoiceComponent.printInvoice();
    this.invoiceSvc.dataShare.next({
      print: true
    })
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
