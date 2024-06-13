import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TDSModalModule, TDSModalRef } from 'tds-ui/modal';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSRadioModule } from 'tds-ui/radio';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSDatePickerModule } from 'tds-ui/date-picker';
import { CustomerListComponent } from '../customer-list.component';
import { AuthService } from '../../../shared.service';
import { TDSNotificationService } from 'tds-ui/notification';
import { catchError } from 'rxjs';

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

  private readonly modalRef = inject(TDSModalRef)

  @Input() id?: number;
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
      this.auth.getCustomer(this.id).subscribe(
        (data: any) => {
          console.log(data);
          this.form.patchValue(data.customerDTO)
        }
      )
    }
  }

  // Cancel button
  handleCancel(): void {
   this.modalRef.destroy(null)
  }

  // Submit button
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

  // Create Customer
  createCustomer(val:any){
    this.auth.CreateNewCustomer(val).subscribe(
      (res) => {
        this.createNotificationSuccess('Create Successfully!', 'A new customer had added to the list.');
        this.modalRef.destroy(val)
      },
      () => {
        this.createNotificationError('Create Fail!', '');
      },
    );
  }

  // Update Customer
  updateCustomer(id:number, val:any){
    this.auth.UpdateCustomer(id, val).subscribe(
      (res) => {
        this.createNotificationSuccess('Update Successfully!', 'Customer '+ val.firstName +' had been updated.');
        this.modalRef.destroy(val)
      },
      (res) => {
        this.createNotificationError('Update Fail!',res.error.message);
        console.log(res.error.message)
      },
    );
  }

  // Success Notification
  createNotificationSuccess(title: string, content: string): void {
    this.notification.success(
      title,
      content
    );
  }

  // Error Notification
  createNotificationError(title: string, content: string): void {
    this.notification.error(
      title,
      content
    );
  }

}
