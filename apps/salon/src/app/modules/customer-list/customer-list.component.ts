/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-empty-function */
import { TDSMapperPipeModule } from 'tds-ui/cdk/pipes/mapper';
import { TDSDataTableModule } from 'tds-ui/data-table';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSColumnSettingsModule } from 'tds-ui/column-settings';
import { TDSListModule } from 'tds-ui/list';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TDSAvatarModule } from 'tds-ui/avatar';
import { TDSModalModule } from 'tds-ui/modal';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSSelectModule } from 'tds-ui/select';
import { TDSRadioModule } from 'tds-ui/radio';
import { TDSNotificationService } from 'tds-ui/notification';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSDatePickerModule } from 'tds-ui/date-picker';
import { error } from 'console';

@Component({
  selector: 'frontend-customer-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TDSListModule,
    TDSDataTableModule,
    TDSColumnSettingsModule,
    TDSAvatarModule,
    TDSMapperPipeModule,
    TDSModalModule,
    TDSFormFieldModule,
    TDSSelectModule,
    TDSRadioModule,
    TDSInputModule,
    TDSDatePickerModule,
  ],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit {

  isVisible = false;
  createCustomerForm!: FormGroup;
  CustomerList:any[] = [];
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
    private router:Router,
    private notification: TDSNotificationService,
  ) {}

  // Display modal
  showModal(): void {
    this.isVisible = true;
  }

  // Save button
  handleOk(): void {
    console.log("Button ok clicked!");
    this.isVisible = false;
  }

  // Cancel button
  handleCancel(): void {
    console.log("Button cancel clicked!");
    this.isVisible = false;
  }

  // Display Customer List
  showCustomerList() {
    this.auth.CustomerList().subscribe(data => {
      this.CustomerList = data;
      console.log('CustomerList:', this.CustomerList)
    });
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

  ngOnInit(): void {

    this.showCustomerList();

  }
}

// interface RootObject {
//   customerID: number;
//   firstName: string;
//   customerCode: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   dateOfBirth: string;
//   gender: string;
//   customerTypeID: number;
//   appointments: null;
//   sales: null;
//   customerType: null;
// }
