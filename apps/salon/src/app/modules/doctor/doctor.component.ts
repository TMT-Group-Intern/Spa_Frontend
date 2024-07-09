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
  public statusOptions = ['Chờ khám', 'Đang khám', 'Đã khám'];
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

  ngOnInit(): void {
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
    this.sharedService.appointmentList(1).subscribe((data: any) => {
      this.appointmentList = data;
      this.reception = this.appointmentList.filter(
        (appointment: any) =>
          appointment.Status === 'Chờ khám' ||
          appointment.Status === 'Đang khám'
      );
    });
  }

  userFrofile(id: number) {
    this.sharedService.getAppointment(id).subscribe((data: any) => {
      this.dataAppointmentbyid = data;
      this.active = true;
      this.CustomerID = data.CustomerID;
      this.form.patchValue({
        phone: data.Customer.Phone,
        name: `${data.Customer.FirstName} ${data.Customer.LastName}`,
        appointmentDate: this.formatDate(data.AppointmentDate, 'HH:mm'),
        customerID: data.Customer.CustomerID,
        status: data.Status,
        service: data.ChooseServices.map((item: any) => item.ServiceID),
        doctor: `${data.Assignments[0].Employees.FirstName} ${data.Assignments[0].Employees.LastName}`,
        note: data.Notes,
      });
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
          if (Status === 'Đã khám') this.active = false;
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

  onCardClick() {
    console.log("hehe")
  }
}
