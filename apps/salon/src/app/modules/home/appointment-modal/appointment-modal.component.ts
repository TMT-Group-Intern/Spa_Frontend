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
import { BehaviorSubject, debounceTime, of, switchMap, Observable, observable, filter } from 'rxjs';
import { CompanyService } from '../../../core/services/company.service';

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
    TDSToolTipModule,
    TDSCalendarModule,
  ],
  templateUrl: './appointment-modal.component.html',
  styleUrls: ['./appointment-modal.component.scss'],
})
export class AppointmentModalComponent implements OnInit {

  searchPhone$ = new BehaviorSubject<string>('')
  public doctorOptions: any[] = [];
  public statusOptions = [
    'Hẹn',
    'Hủy hẹn',
  ]
  private readonly tModalSvc = inject(TDSModalService)
  private readonly modalRef = inject(TDSModalRef);
  @Input() id?: number;
  @Input() formatTime?: string;

  createAppointmentForm!: FormGroup;
  form = inject(FormBuilder).nonNullable.group({
    customerID: [],
    name: [''],
    branch: [''],
    phone: ['', [Validators.required, Validators.pattern(/^[0]{1}[0-9]{9}$/)]],
    assignments: [],
    doctor: [],
    appointmentDate: [new Date()] || null,
    status: ['Hẹn'],
    customer: [null]
  });
  // isExist = false;
  // Hide search Phone Number
  isHide1 = false;
  // Hide Display Phone Number
  isHide2 = true;
  today = startOfToday();
  empID: any[] = [];
  dataCustomer: any[] = [];
  assign: any[] = [];
  userSession: any;

  constructor(
    private shared: AuthService,
    private notification: TDSNotificationService,
    private companySvc: CompanyService
  ) { }

  ngOnInit(): void {
    this.initCustomer();
    const storedUserSession = localStorage.getItem('userSession');
    if (storedUserSession !== null) {
      this.userSession = JSON.parse(storedUserSession);
    }
    this.form.get('name')?.disable();
    this.form.get('branch')?.disable();

    this.isHide1 = false;
    this.isHide2 = true;

    // this.form.patchValue({
    //   branch:this.userSession.user.branch
    // })
    this.shared.getBranchName(this.userSession.user.branchID).subscribe(
      (res: any) => {
        this.form.patchValue({
          branch: res.getBranchNameByID
        });
      }
    )

    if (this.id) {
      this.form.get('phone')?.disable()
      this.isHide1 = true;
      this.isHide2 = false;
      this.shared.getAppointment(this.id).subscribe(
        (data: any) => {

          this.shared.getBranchName(data.BranchID).subscribe(
            (res: any) => {
              this.form.patchValue({
                branch: res.getBranchNameByID
              });
            }
          )
          let timeNew: any = ''
          if (this.formatTime) {
            timeNew = this.formatTime
          } else {
            timeNew = data.AppointmentDate
          }
          console.log(timeNew);
          this.form.patchValue({
            phone: data.Customer.Phone,
            name: data.Customer.LastName + ' ' + data.Customer.FirstName,
            appointmentDate: data.AppointmentDate,
            customerID: data.Customer.CustomerID,
            status: data.Status,
          });

          this.assign = data.Assignments
          const foundDoctor = this.assign.find(item => item.Employees.JobTypeID === 2);
          if (foundDoctor) {
            this.form.patchValue({
              doctor: foundDoctor.Employees.EmployeeID
            });
          }

        });
    }

    // Get Doctor
    this.shared.getEmployee(this.userSession.user.branchID, 2).subscribe(
      (data: any[]) => {
        this.doctorOptions = [...data.map(item => ({
          id: item.employeeID,
          name: `${item.lastName} ${item.firstName}`
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

    const { doctor, appointmentDate, ...req } = this.form.value;

    if (doctor != null) {
      // Add employee to the array
      this.empID.push(doctor);
    }

    const val: any = {
      ...req,
      appointmentDate: format(
        new Date(appointmentDate as Date), DATE_CONFIG.DATE_BASE
      ),
      employeeID: this.empID,
      branchID: this.userSession.user.branchID
    };

    if (doctor != null) {
      val.assignments = [{ employerID: doctor }];
    }

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
        name: data.lastName + ' ' + data.firstName
      })
    })
  }

  // Create Appointment
  createAppointment(val: any) {
    this.shared.createAppointment(val).subscribe({

      next: () => {
        this.createNotificationSuccess('');
        this.modalRef.destroy(val);
      },
      error: (res) => {
        this.createNotificationError(res.error.message);
      },
    });
  }

  // Open Create Customer Modal
  createCustomer() {
    const modal = this.tModalSvc.create({
      title: 'Tạo khách hàng',
      content: CustomerModalComponent,
      footer: null,
      size: 'lg',
    });
    modal.afterClose.asObservable().subscribe((res) => {
      if (res) {
        this.shared.searchCustomer(res.phone).subscribe(
          (_res: any) => {
            this.form.patchValue({
              name: res.firstName + ' ' + res.lastName,
              customerID: _res.customers[0].customerID,
            });
          }
        )
        // this.isExist = false
      }
    });
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

  // getBranch(branchID:number):any{
  //   return ;
  // }
  // Success Notification
  createNotificationSuccess(content: any): void {
    this.notification.success('Succesfully', content);
  }

  // Error Notification
  createNotificationError(content: any): void {
    this.notification.error('Error', content);
  }


}
