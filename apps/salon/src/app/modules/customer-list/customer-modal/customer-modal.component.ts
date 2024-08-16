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
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  filter,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { TDSNotificationService } from 'tds-ui/notification';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSSelectModule } from 'tds-ui/select';
import { startOfToday, isAfter } from 'date-fns';
import { format } from 'date-fns';
import { DATE_CONFIG } from '../../../core/enums/date-format.enum';

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
    TDSButtonModule,
    TDSSelectModule,
  ],
  templateUrl: './customer-modal.component.html',
  styleUrls: ['./customer-modal.component.scss'],
})
export class CustomerModalComponent implements OnInit {
  searchPhone$ = new BehaviorSubject<string>('');
  private readonly modalRef = inject(TDSModalRef);
  private readonly modalService = inject(TDSModalService);
  @Input() id?: number;
  @Input() phoneNum?: string;
  createCustomerForm!: FormGroup;
  dataCustomer: any;
  today = startOfToday();
  checkPhone?: boolean = false;
  form = inject(FormBuilder).nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.email],
    phone: ['', [Validators.required, Validators.pattern(/^[0]{1}[0-9]{9}$/)]],
    dateOfBirth: [],
    gender: ['Nam'],
  });

  constructor(
    private auth: AuthService,
    private notification: TDSNotificationService
  ) { }

  ngOnInit(): void {
    if (this.id) {
      this.auth.getCustomer(this.id).subscribe((data: any) => {
        const { firstName, lastName, email, phone, dateOfBirth, gender } =
          data.customerDTO;
        this.dataCustomer = data.customerDTO;
        this.form.patchValue({
          firstName,
          lastName,
          email,
          phone,
          dateOfBirth,
          gender,
        });
      });
    } else {
      this.checkNumberPhone();
    }
  }

  checkNumberPhone() {
    this.form
      .get('phone')
      ?.valueChanges.pipe(
        debounceTime(100),
        filter((phone) => phone !== null && phone.length == 10),
        switchMap((search: string) => {
          return search ? this.auth.searchCustomer(search) : of(null);
        })
      )
      .subscribe((data: any) => {
        if (data.customers.phone !== null && data.customers.length > 0) {
          this.checkPhone = true;
        } else {
          this.checkPhone = false;
        }
      });
  }

  // Disabled Date in the future
  disabledDate = (d: Date): boolean => {
    // Disable all days after today
    return isAfter(d, this.today);
  };

  // Cancel button
  handleCancel(): void {
    this.modalRef.destroy(null);
  }

  // Submit button
  submit() {
    if (this.form.invalid || this.checkPhone) return;

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
    this.auth
      .CreateNewCustomer(val)
      .pipe(
        catchError((ex) => {
          return of(null);
        })
      )
      .subscribe({
        next: () => {
          this.createNotificationSuccess('');
          this.modalRef.destroy(val);
        },
        error: (res) => {
          this.createNotificationError(res.error.message);
        },
      });
  }

  // Update Customer
  updateCustomer(id: number, val: any) {
    this.auth.UpdateCustomer(id, val).subscribe({
      next: () => {
        this.createNotificationSuccess('');
        this.modalRef.destroy(val);
      },
      error: (res) => {
        this.createNotificationError(res.error.message);
      },
    });
  }

  // Success Notification
  createNotificationSuccess(content: any): void {
    this.notification.success('Succesfully', content);
  }

  // Error Notification
  createNotificationError(content: any): void {
    this.notification.error('Error', content);
  }
}
