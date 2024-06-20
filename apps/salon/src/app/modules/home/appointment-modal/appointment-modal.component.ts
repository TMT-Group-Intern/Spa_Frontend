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
import { startOfToday, isBefore } from 'date-fns';
import { TDSTimePickerModule } from 'tds-ui/time-picker';
// npm install moment --f
import * as moment from 'moment';

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

  public doctorOptions = [
    { id: 11, name: 'Elton John' },
    { id: 12, name: 'Elvis Presley' },
    { id: 9, name: 'Paul McCartney' },
    { id: 14, name: 'Elton John' },
    { id: 13, name: 'Elvis Presley' },
  ]

  public statusOptions = [
    'Comming',
    'Comming2',
  ]

  private readonly tModalSvc = inject(TDSModalService)
  private readonly modalRef = inject(TDSModalRef);
  @Input() id?: number;
  createAppointmentForm!: FormGroup;
  form = inject(FormBuilder).nonNullable.group({
    customerID: [],
    name: [''],
    branch: ['ABC'],
    phone: ['', [Validators.required, Validators.pattern(/^[0]{1}[0-9]{9}$/)]],
    employeeID: [[0]],
    assignments: [[]],
    doctor: [0],
    appointmentDate: ['', Validators.required],
    status: [''],
  });
  isExist = false;
  isHide = false;
  today = startOfToday();
  empID: any[] = []

  constructor(
    private shared: AuthService,
    private notification: TDSNotificationService,
  ) { }

  ngOnInit(): void {

    this.form.get('name')?.disable()
    this.form.get('branch')?.disable()

    this.isHide = false;

    if (this.id) {
      this.form.get('phone')?.disable()
      this.isHide = true;
      this.shared.getAppointment(this.id).subscribe((data: any) => {
        console.log(data);
        this.form.patchValue({
          phone: data.Customer.Phone,
          name: data.Customer.FirstName + ' ' + data.Customer.LastName,
          appointmentDate: data.AppointmentDate,
          customerID: data.Customer.CustomerID,
          status: data.Status,
        });
      });
    }

  }



  // Disabled Date in the past
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

    if (this.form.invalid) return;

    // Add employee to the array
    this.empID.push(this.form.value.doctor)
    this.form.patchValue({
      employeeID: this.empID
    });

    const val = {
      // customerID: this.form.value.customerID,
      // employeeID: this.form.value.employeeID,
      // appointmentDate: moment(this.form.value.appointmentDate).format("YYYY-MM-DDTHH:mm:ss"),
      // status: this.form.value.status,
      ...this.form.value
    };
    console.log(val)

    if (this.id) {
      this.updateAppointment(this.id, val);
    } else {
      this.createAppointment(val);
    }
  }

  // Search Customer
  searchCustomer() {

    // Check (only) phone valid or not
    const controls = this.form.controls;
    if (controls['phone'].invalid) return;

    this.shared.searchCustomer(this.form.value.phone).subscribe(
      (res: any) => {
        if (res.customers.length == 0) { // If phone does not exist
          this.form.patchValue({
            name: '',
            customerID: undefined,
          });
          this.isExist = true
        } else { // If phone exists
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

  // Open Create Customer Modal
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

    modal.afterClose.asObservable().subscribe(res1 => {
      if (res1) {
        this.shared.searchCustomer(res1.phone).subscribe(
          (res2: any) => {
            this.form.patchValue({
              name: res1.firstName + ' ' + res1.lastName,
              customerID: res2.customers[0].customerID,
            });
          }
        )
        this.isExist = false
      }
    })
  }

  // Update Appointment
  updateAppointment(id: number, val: any) {
    this.shared.UpdateAppointment(id, val).subscribe(
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
