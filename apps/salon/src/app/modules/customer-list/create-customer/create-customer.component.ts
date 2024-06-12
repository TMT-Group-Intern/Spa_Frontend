import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSModalModule } from 'tds-ui/modal';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSRadioModule } from 'tds-ui/radio';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSDatePickerModule } from 'tds-ui/date-picker';
import { AuthService } from '../../../services/auth.service';
import { TDSNotificationService } from 'tds-ui/notification';

@Component({
  selector: 'frontend-create-customer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TDSModalModule,
    TDSFormFieldModule,
    TDSRadioModule,
    TDSInputModule,
    TDSDatePickerModule,
  ],
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss'],
})
export class CreateCustomerComponent {

  isVisible = false;
  createCustomerForm!: FormGroup;
  form = inject(FormBuilder).nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.required],
    phone: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    gender: ['', Validators.required],
  })

  constructor(
    private auth : AuthService,
    private notification: TDSNotificationService,
  ) {}

  // Display modal
  showModal(): void {
    this.isVisible = true;
  }

  // Cancel button
  handleCancel(): void {
    console.log("Button cancel clicked!");
    this.isVisible = false;
  }

  // Create New Customer
  CreateNewCustomer() {
    if(this.form.invalid) return;
    const val = {
      ...this.form.value
    };

    this.auth.CreateNewCustomer(val).subscribe(
      () => {
        this.handleCancel();
        this.createNotificationSuccess();
      },

      () => {
        this.createNotificationError();
      });
  }

  createNotificationSuccess(): void {
    this.notification.success(
        'Create Successfully!',
        'One customer is added in the list.'
    );
  }

  createNotificationError(): void {
    this.notification.error(
        'Create Fail!',
        'Add new customer fail.'
    );
  }

}
