import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../shared.service';
import * as moment from 'moment';
import { TDSTableModule } from 'tds-ui/table';
import { FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSInputNumberModule } from 'tds-ui/input-number';
import { TDSModalModule, TDSModalRef } from 'tds-ui/modal';
import { TDSNotificationService } from 'tds-ui/notification';

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
  ],
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss'],
})
export class PaymentModalComponent implements OnInit {

  private readonly modalRef = inject(TDSModalRef);
  @Input() id?: number
  inforCus: any;
  service: any[] = [];
  discountAmount: any;
  totalAmount: any;
  createAppointmentForm!: FormGroup;
  form = inject(FormBuilder).nonNullable.group({
    diDiscountPercentage: [0],
  });

  constructor(
    private shared: AuthService,
    private notification: TDSNotificationService,
  ) {}

  ngOnInit(): void {

    if(this.id){
       this.shared.getAppointment(this.id).subscribe(
        (data: any) => {
          console.log(data)
          this.inforCus = data;
          this.service = data.ChooseServices;
          this.discountAmount = data.DiscountAmount;
          if(data.DiscountPercentage != null) {
            this.form.patchValue({
              diDiscountPercentage: data.DiscountPercentage,
            });
          }
          this.totalAmountAfterDiscount(data.Total)
        }
       )
    }

  }

  // Format Date & Time
  formatDate(date: string, format: string): string {
    return moment(date).format(format);
  }

  // Update Discount
  updateDiscount() {
    this.shared.updateDiscount(this.id, this.form.value.diDiscountPercentage,'').subscribe(
      () => {
        this.ngOnInit()
      }
    )
  }

  // Calculate the price after use discount
  totalAmountAfterDiscount(total:number) {
    this.totalAmount = total - this.discountAmount;
  }

  submit() {
    this.shared.createPayment(this.id,'').subscribe(
      () => {
        this.createNotificationSuccess('');
        this.modalRef.destroy(this.id);
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
