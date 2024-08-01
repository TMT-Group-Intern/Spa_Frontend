import { TDSEmptyModule } from 'tds-ui/empty';
import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSCardModule } from 'tds-ui/card';
import { TDSTagModule } from 'tds-ui/tag';
import { AuthService } from '../../shared.service';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSTypographyModule } from 'tds-ui/typography';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSTimePickerModule } from 'tds-ui/time-picker';
import { TDSHeaderModule } from 'tds-ui/header';
import { TDSImageModule } from 'tds-ui/image';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSToolTipModule } from 'tds-ui/tooltip';
import * as moment from 'moment';
import { startOfToday } from 'date-fns';
import { TDSSelectModule } from 'tds-ui/select';
import { TDSNotificationService } from 'tds-ui/notification';
import { TDSInputModule } from 'tds-ui/tds-input';
import { CompanyService } from '../../core/services/company.service';
import { concatMap, filter } from 'rxjs';

@Component({
  selector: 'frontend-doctor',
  standalone: true,
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TDSCardModule,
    TDSTagModule,
    TDSButtonModule,
    TDSTypographyModule,
    TDSTimePickerModule,
    TDSHeaderModule,
    TDSCardModule,
    TDSImageModule,
    TDSFormFieldModule,
    TDSEmptyModule,
    TDSToolTipModule,
    TDSSelectModule,
    TDSInputModule,
  ],
})

export class DoctorComponent implements OnInit {
  public statusOptions = [
    'Chờ khám',
    'Đang khám',
    'Đã khám',
    'Không sử dụng dịch vụ',
  ];
  @Input() id?: number;
  private readonly notification = inject(TDSNotificationService);
  private readonly sharedService = inject(AuthService);
  reception: any[] = [];
  active?: boolean;
  appointmentList: any;
  serviceHistory: any;
  fallback = './assets/img/default.svg';
  dataAppointmentbyid: any;
  today = startOfToday();
  empID: any[] = [];
  dataSvc: any = [];
  CustomerID: number | undefined;
  userSession: any;
  companyId: number | null = null;

  appointments: any[] = [];

  form = inject(FormBuilder).nonNullable.group({
    customerID: [],
    name: [''],
    branch: [''],
    phone: ['', [Validators.required, Validators.pattern(/^[0]{1}[0-9]{9}$/)]],
    employeeID: [[0]],
    assignments: [[]],
    doctor: [''],
    appointmentDate: ['', Validators.required],
    status: [''],
    service: [[]],
    note: [''],
  });
  constructor(
    private companySvc: CompanyService
  ) { }

  ngOnInit(): void {
    console.log(1)
    //  this.sharedService.addAppointmentDataListener(this.onReceiveAppointments.bind(this));
    this.sharedService.DataListenerDoctorChagneStatus(this.onReceiveAppointments.bind(this));
    // console.log(this.appointments);

    const storedUserSession = localStorage.getItem('userSession');
    if (storedUserSession !== null) {
      this.userSession = JSON.parse(storedUserSession);
    }
    this.initAppointmentList();

    this.companySvc._companyIdCur$.pipe(
      filter(companyId => !!companyId),
      concatMap((branchID) => {
        return this.sharedService.appointmentList(branchID as number)
      })
    ).subscribe((data: any) => {
      this.appointmentList = data;
      this.reception = this.appointmentList.filter(
        (appointment: any) =>
          appointment.status === 'Chờ khám' ||
          appointment.status === 'Đang khám'
      );
    });
  }
  onReceiveAppointments(): void {
    this.initAppointmentList();

  }

  initService(): void {
    //Display Service List
    this.sharedService.renderListService().subscribe((data: any) => {
      this.dataSvc = data.serviceDTO;
    });
  }
  // Format Date & Time
  formatDate(date: string, format: string): string {
    return moment(date).format(format);
  }

  // Display Appointment List
  initAppointmentList() {
    const branchID = this.userSession.user.branchID
    this.sharedService.appointmentList(branchID).subscribe((data: any) => {
      this.appointmentList = data;
      this.reception = this.appointmentList.filter(
        (appointment: any) =>
          (appointment.status === 'Chờ khám' ||
            appointment.status === 'Đang khám')
          && (appointment.employeeCode === this.userSession.user.userCode
            || this.userSession.user.role === 'Admin')
      );
    });
  }

  userFrofile(id: number) {
    this.sharedService.getAppointment(id).subscribe((data: any) => {
      this.dataAppointmentbyid = data;
      this.active = true;
      this.CustomerID = data.customerID;
      this.form.patchValue({
        phone: data.customer.phone,
        name: `${data.customer.firstName} ${data.customer.lastName}`,
        appointmentDate: this.formatDate(data.appointmentDate, 'HH:mm'),
        customerID: data.customer.customerID,
        status: data.status,
        service: data.chooseServices.map((item: any) => item.serviceID),
        note: data.notes,
      });
      const foundDoctor = (data.assignments as any[]).find(item => item.employees.jobTypeID === 2);
      if (foundDoctor) {
        this.form.patchValue({
          doctor: `${foundDoctor.employees.lastName} ${foundDoctor.employees.firstName}`
        });
      }
    });
    this.initService();
  }

  getHistory(id: number) {
    this.sharedService.getHistoryCustomer(id).subscribe((data: any) => {
      this.serviceHistory = data.listHistoryForCus.sort((a: any, b: any) =>
        b.date < a.date ? -1 : 1
      );
    });
  }

  submitUpdateServiceAppointment(id: number) {
    if (this.form.invalid) return;

    const val = {
      ...this.form.value,
    };

    if (id) {
      this.updateServiceAppointment(id, val.status, val.service, val.note);
    }
  }

  // Update service Appointment
  updateServiceAppointment(
    id: number,
    Status: any,
    ListServiceID: any,
    Notes: any
  ) {
    this.sharedService
      .updateAppointmentWithService(id, { ListServiceID, Status, Notes })
      .subscribe({
        next: (data) => {
          this.createNotificationSuccess('');
          this.initAppointmentList();
          if (Status === 'Đã khám' || Status === 'Không sử dụng dịch vụ')
            this.active = false;
        },
        error: (res) => {
          this.createNotificationError(res.error.message);
        },
      });
  }
  // Success Notification
  createNotificationSuccess(content: any): void {
    this.notification.success('Thành công', content);
  }

  // Error Notification
  createNotificationError(content: any): void {
    this.notification.error('Lỗi. Vui lòng kiểm tra!', content);
  }

  onCardClick() {
    console.log("hehe")
  }
}
