import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSModalModule, TDSModalRef } from 'tds-ui/modal';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSRadioModule } from 'tds-ui/radio';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSDatePickerModule } from 'tds-ui/date-picker';
import { AuthService } from '../../../services/auth.service';
import { TDSNotificationService } from 'tds-ui/notification';
import { CustomerListComponent } from '../customer-list.component';

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
    CustomerListComponent,
  ],
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss'],
})
export class CreateCustomerComponent implements OnInit{
  private readonly modalRef = inject(TDSModalRef)
  @Input() id?:string;
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

  ngOnInit(): void {
    console.log(this.id);

    if(this.id){
      // this.auth.
    }
    // todo get data by id
    // subscribe => form pathvalue
  }

  // Cancel button
  handleCancel(): void {
   this.modalRef.destroy(null)
  }

  // Create New Customer
  submit() {
    if(this.form.invalid) return;
    const val = {
      ...this.form.value
    };

    if(this.id){
      this.updateCustomer(this.id,val)
    }
    else{
      this.createCustomer(val)
    }
  }

  createCustomer(val:any){
    this.auth.CreateNewCustomer(val).subscribe(
      (res) => {
        this.createNotificationSuccess();
        this.modalRef.destroy(val)
      },
      () => {
        this.createNotificationError();
      },
    );
  }

  updateCustomer(id:string, val:any){
    //todo call api update and this.modalRef.destroy(val)
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
