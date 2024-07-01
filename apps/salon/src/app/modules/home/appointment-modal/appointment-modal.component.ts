import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TDSModalModule, TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSFormFieldModule } from 'tds-ui/form-field';
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
import { DATE_CONFIG } from '../../../core/enums/date-format.enum';
import { format } from 'date-fns';
import { TDSToolTipModule } from 'tds-ui/tooltip';
import { BehaviorSubject, debounceTime, of, switchMap } from 'rxjs';

@Component({
  selector: 'frontend-appointment-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TDSModalModule,
    TDSFormFieldModule,
    TDSInputModule,
    TDSDatePickerModule,
    CustomerListComponent,
    TDSCalendarModule,
    TDSButtonModule,
    TDSSelectModule,
    TDSTimePickerModule,
    TDSToolTipModule
  ],
  templateUrl: './appointment-modal.component.html',
  styleUrls: ['./appointment-modal.component.scss'],
})

export class AppointmentModalComponent implements OnInit {

  searchPhone$ = new BehaviorSubject<string>('')
  public doctorOptions: any[] = [];

  public statusOptions = [
    'Scheduled',
    'Confirmed',
    'Cancelled',
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
    assignments: [],
    doctor: [],
    appointmentDate: [new Date()],
    status: ['Scheduled'],
    customer: [null]
  });
  isExist = false;
  isHide = false;
  today = startOfToday();
  empID: any[] = []
  dataCustomer: any[] = []

  constructor(
    private shared: AuthService,
    private notification: TDSNotificationService,
  ) { }

  ngOnInit(): void {
    this.initCustomer();

    this.form.get('name')?.disable()
    this.form.get('branch')?.disable()

    this.isHide = false;

    if (this.id) {
      this.form.get('phone')?.disable()
      this.isHide = true;
      this.shared.getAppointment(this.id).subscribe((data: any) => {
        this.form.patchValue({
          phone: data.Customer.Phone,
          name: data.Customer.FirstName + ' ' + data.Customer.LastName,
          appointmentDate: data.AppointmentDate,
          customerID: data.Customer.CustomerID,
          status: data.Status,
          assignments: data.Assignments,
        });
        if (this.form.value.assignments) {
          this.form.patchValue({
            doctor: data.Assignments[0].EmployerID,
          });
        }
        console.log(this.form.value)
      });

    }

    // Get Doctor
    this.shared.getEmployee(2, 2).subscribe(
      (data: any[]) => {
        this.doctorOptions = [...data.map(item => ({
          id: item.employeeID,
          name: `${item.firstName} ${item.lastName}`
        }))]
      })

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

    const { doctor, appointmentDate, ...req } = this.form.value

    if (doctor != null) {
      // Add employee to the array
      this.empID.push(doctor)
    }

    const val: any = {
      ...req,
      appointmentDate: format(new Date(appointmentDate as Date), DATE_CONFIG.DATE_BASE),

      employeeID: this.empID,
    };
    if (doctor != null) {
      val.assignments = [{ employerID: doctor }];
    }


    console.log(val.employeeID)
    if (this.id) {
      this.updateAppointment(this.id, val);
    } else {
      this.createAppointment(val);
    }
  }


  initCustomer() {
    this.searchPhone$.pipe(
      debounceTime(100),
      switchMap((search: string) => {
        return search ? this.shared.searchCustomer(search) : of(null)
      })
    ).subscribe((data) => {
      if (data)
        this.dataCustomer = data.customers;
    })

    this.form.get('customer')?.valueChanges.subscribe((data: any) => {
      this.form.patchValue({
        ...data as any,
        name: data.firstName + ' ' + data.lastName
      })
    })
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
      title: 'Tạo khách hàng',
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
