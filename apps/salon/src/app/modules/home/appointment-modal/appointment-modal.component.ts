import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TDSModalModule, TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSRadioModule } from 'tds-ui/radio';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSDatePickerModule } from 'tds-ui/date-picker';
import { CustomerListComponent } from '../../customer-list/customer-list.component';
import { AuthService } from '../../../shared.service';
import { TDSCalendarModule } from 'tds-ui/calendar';
import { TDSButtonModule } from 'tds-ui/button';
import { CustomerModalComponent } from '../../customer-list/customer-modal/customer-modal.component';
import { TDSSelectModule } from 'tds-ui/select';
import { TDSNotificationService } from 'tds-ui/notification';
import { startOfToday, isBefore, isWeekend } from 'date-fns';
import { TDSTimePickerModule } from 'tds-ui/time-picker';

@Component({
  selector: 'frontend-appointment-modal',
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
    TDSCalendarModule,
    TDSButtonModule,
    TDSSelectModule,
    TDSTimePickerModule,
  ],
  templateUrl: './appointment-modal.component.html',
  styleUrls: ['./appointment-modal.component.scss'],
})
export class AppointmentModalComponent implements OnInit {

  public contactOptions = [
    { id: 11, name: 'Elton John' },
    { id: 12, name: 'Elvis Presley' },
    { id: 9, name: 'Paul McCartney' },
    { id: 14, name: 'Elton John' },
    { id: 13, name: 'Elvis Presley' },
  ]

  @Input() id?: number;
  @Input() phoneNum?: any;

  private readonly tModalSvc = inject(TDSModalService)
  private readonly modalRef = inject(TDSModalRef);
  createAppointmentForm!: FormGroup;
  form = inject(FormBuilder).nonNullable.group({
    customerID: [],
    name: [''],
    branch: ['ABC'],
    phone: ['', [Validators.required, Validators.pattern(/^[0]{1}[0-9]{9}$/)]],
    EmployeeID: [[0]],
    doctor: [0],
    appointmentDate: ['', Validators.required],
  });
  isExist = false;
  today = startOfToday();
  currentDate: Date = new Date();
  empID: any[] = []

  constructor(
    private shared: AuthService,
    private notification: TDSNotificationService,
  ) { }

  ngOnInit(): void {

    this.form.get('name')?.disable()
    this.form.get('branch')?.disable()

    if (this.id) {
      this.shared.getCustomer(this.id).subscribe((data: any) => {
        console.log(data);
        this.form.patchValue(data.customerDTO);
      });
    }

  }

  disabledDate = (d: Date): boolean => {
    // Disable all days before today
    return isBefore(d, this.today);
  };

  // Cancel button
  handleCancel(): void {
    this.modalRef.destroy(null);
  }

  // Submit button
  submit() {

    console.log(this.form.value.appointmentDate)

    if (this.form.invalid) return;
    this.empID.push(this.form.value.doctor)

    this.form.patchValue({
      EmployeeID: this.empID
    });

    const val = {
      customerID: this.form.value.customerID,
      EmployeeID: this.form.value.EmployeeID,
      appointmentDate: this.form.value.appointmentDate,
    };

    if (this.id) {
      this.updateCustomer(this.id, val);
    } else {
      this.createAppointment(val);
    }
  }

  // Search Customer
  searchCustomer() {

    const controls = this.form.controls;
    if (controls['phone'].invalid) return;

    this.shared.searchCustomer(this.form.value.phone).subscribe(
      (res: any) => {

        if (res.customers.length == 0) {
          this.form.patchValue({
            name: '',
            customerID: undefined,
          });
          this.isExist = true
        }

        else {
          this.form.patchValue({
            name: res.customers[0].firstName + ' ' + res.customers[0].lastName,
            customerID: res.customers[0].customerID,
          });
          this.isExist = false
        }
      },
    )
  }

  // Create Appointment
  createAppointment(val: any) {
    this.shared.createAppointment(val).subscribe(
      {
        next: () => {
          this.createNotificationSuccess('');
          this.modalRef.destroy(val);
        },
        error: (res) => {
          this.createNotificationError(res.error.message);
        },
      }
    );
  }

  // Create Customer
  createCustomer(phoneNum: any) {

    const modal = this.tModalSvc.create({
      title: 'Create Customer',
      content: CustomerModalComponent,
      footer: null,
      size: 'lg',
      componentParams: {
        phoneNum
      }
    });

    modal.afterClose.asObservable().subscribe(res => {
      if (res) {
        console.log(res)
        this.form.patchValue({
          name: res.firstName + ' ' + res.lastName,
          customerID: res.customerID,
        });
        this.isExist = false
      }
    })
  }

  // Update Customer
  updateCustomer(id: number, val: any) {
    this.shared.UpdateCustomer(id, val).subscribe(
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
