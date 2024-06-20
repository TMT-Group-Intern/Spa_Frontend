import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TDSModalModule, TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSRadioModule } from 'tds-ui/radio';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSDatePickerModule } from 'tds-ui/date-picker';
import { CustomerListComponent } from '../customer-list.component';
import { AuthService } from '../../../shared.service';
import { TDSNotificationService } from 'tds-ui/notification';

@Component({
  selector: 'frontend-customer-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TDSModalModule,
    TDSFormFieldModule,
    TDSRadioModule,
    TDSInputModule,
    TDSDatePickerModule,
    CustomerListComponent,
  ],
  templateUrl: './customer-modal.component.html',
  styleUrls: ['./customer-modal.component.scss'],
})
export class CustomerModalComponent implements OnInit {

  private readonly modalRef = inject(TDSModalRef);
  @Input() id?: number;
  @Input() phoneNum?: string;
  createCustomerForm!: FormGroup;
  form = inject(FormBuilder).nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.email],
    phone: ['', [Validators.required, Validators.pattern(/^[0]{1}[0-9]{9}$/)]],
    dateOfBirth: ['', Validators.required],
    gender: ['Male'],
  });

  constructor(
    private auth: AuthService,
    private notification: TDSNotificationService
  ) { }

  ngOnInit(): void {
    console.log(this.id);

    if (this.phoneNum) {
      this.form.patchValue({
        phone: this.phoneNum
      })
    }

    if (this.id) {
      this.auth.getCustomer(this.id).subscribe((data: any) => {
        this.form.patchValue(data.customerDTO);
      });
    }
  }

  // Cancel button
  handleCancel(): void {
    this.modalRef.destroy(null);
  }

  // Submit button
  submit() {
    if (this.form.invalid) return;

    const val = {
      ...this.form.value,
    };

    if (this.id) {
      this.updateCustomer(this.id, val);
    } else {
      this.createCustomer(val);
    }
  }

  // Create Customer
  createCustomer(val: any) {
    this.auth.CreateNewCustomer(val).subscribe(
      {
        next: (res) => {
          this.createNotificationSuccess('');
          this.modalRef.destroy(val);
        },
        error: (res) => {
          this.createNotificationError(res.error.message);
        },
      }
    );
  }

  // Update Customer
  updateCustomer(id: number, val: any) {
    this.auth.UpdateCustomer(id, val).subscribe(
      () => {
        this.createNotificationSuccess('');
        this.modalRef.destroy(val);
      },
      (res) => {
        this.createNotificationError(res.error.message);
      }
    );
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
