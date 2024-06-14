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
import { catchError, of } from 'rxjs';

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
  private readonly modalService = inject(TDSModalService);
  @Input() id?: number;
  createCustomerForm!: FormGroup;
  form = inject(FormBuilder).nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.email],
    phone: ['', [Validators.required, Validators.pattern(/^[0]{1}[0-9]{9}$/)]],
    dateOfBirth: ['', Validators.required],
    gender: ['Male'],
  });

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    console.log(this.id);

    if (this.id) {
      this.auth.getCustomer(this.id).subscribe((data: any) => {
        console.log(data);
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
    this.auth.CreateNewCustomer(val).pipe(
      catchError((res) => {
        console.log(res)
        return of(null)
      })
    ).subscribe(
      {
        next: (v) => {
          this.modalService.success({
            title: 'Successfully!',
            okText: 'OK',
          });
          this.modalRef.destroy(val);
        },
        error: (res) => {
          this.modalService.error({
            title: 'Fail!',
            content: res.error.message,
            okText: 'OK'
          });
        },
      }
    );
  }

  // Update Customer
  updateCustomer(id: number, val: any) {
    this.auth.UpdateCustomer(id, val).subscribe(
      (res) => {
        this.modalService.success({
          title: 'Successfully!',
          okText: 'OK',
        });
        this.modalRef.destroy(val);
      },
      (res) => {
        this.modalService.error({
          title: 'Fail!',
          content: res.error.message,
          okText: 'OK',
        });
      }
    );
  }
}
