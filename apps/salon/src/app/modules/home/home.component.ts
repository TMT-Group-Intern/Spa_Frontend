import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSButtonModule } from 'tds-ui/button';
import { AuthService } from '../../shared.service';
import { TDSCardModule } from 'tds-ui/card';
import { TDSHeaderModule } from 'tds-ui/header';
import * as moment from 'moment'; // npm install moment --f
import { TDSTagModule } from 'tds-ui/tag';
import { TDSModalService } from 'tds-ui/modal';
import { AppointmentModalComponent } from './appointment-modal/appointment-modal.component';
import { TDSToolTipModule } from 'tds-ui/tooltip';
import { TDSTypographyModule } from 'tds-ui/typography';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { ChooseDoctorModalComponent } from './choose-doctor-modal/choose-doctor-modal.component';
import { InSessionModalComponent } from './in-session-modal/in-session-modal.component';
import { TDSEmptyModule } from 'tds-ui/empty';
import { InvoiceService } from '../invoice/invoice.service';
import { error } from 'console';
import { TDSMapperPipeModule } from 'tds-ui/cdk/pipes/mapper';
import { CompanyService } from '../../core/services/company.service';
import { concatMap, filter, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { TDSCalendarMode } from 'tds-ui/date-picker';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { format, isSameDay } from 'date-fns';
import { TDSCalendarModule, WeekViewHourSegment } from 'tds-ui/calendar';
import { DATE_CONFIG } from '../../core/enums/date-format.enum';
import { ReactiveFormsModule } from '@angular/forms';
import { BillModalComponent } from './bill-modal/bill-modal.component';
import { CustomerModalComponent } from '../customer-list/customer-modal/customer-modal.component';
import { PaymentModalComponent } from './payment-modal/payment-modal.component';


@Component({
  selector: 'frontend-home',
  standalone: true,
  imports: [
    CommonModule,
    TDSButtonModule,
    TDSCardModule,
    TDSHeaderModule,
    TDSTagModule,
    TDSToolTipModule,
    TDSTypographyModule,
    TDSFormFieldModule,
    TDSEmptyModule,
    ReactiveFormsModule,
    TDSCalendarModule,
    TDSToolTipModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  appointmentList: any[] = [];
  time: any;
  todayBooking: any[] = [];
  reception: any[] = [];
  inSession: any[] = [];
  status: any;
  userSession: any;
  assign: any[] = [];

  storedUserSession = localStorage.getItem('userSession');
  oldBranch: any;
  companyId: number | null = null;

  private readonly shareApi = inject(AuthService);
  private readonly company = inject(CompanyService);
  private readonly modalSvc = inject(TDSModalService);
  private cdr = inject(ChangeDetectorRef);
  dayStartHour = 8;
  dayEndHour = 17;
  date = new Date();
  mode: TDSCalendarMode = 'date';
  lstData: Array<{ start: Date; end: Date; data: TDSSafeAny }> = [];
  dataAppointments: any;
  // options = ['Chờ chăm sóc', 'Thanh toán'];

  constructor(
    private sharedService: AuthService,
    private invoiceSvc: InvoiceService,
    private companySvc: CompanyService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (this.storedUserSession !== null) {
      this.userSession = JSON.parse(this.storedUserSession);
      this.initAppointment();
    }

    this.company._companyIdCur$
      .pipe(
        filter((companyId) => !!companyId),
        concatMap((brachID) => {
          return this.shareApi.appointmentList(brachID as number);
        })
      )
      .subscribe(
        (data: any) => {
          this.dataAppointment(data)
        }
      )
  }

  // call get list of appoiment
  initAppointment() {
    this.companySvc._companyIdCur$.pipe(
      filter(branchID=> !!branchID),
      switchMap((branchID)=> {
       return branchID?this.shareApi.appointmentList(branchID):of(null)
      })
    ).subscribe(
      (data: any) => {
        this.dataAppointment(data)
      });
    
    
  }

  //
  dataAppointment(data: any) {
    this.dataAppointments = data
    this.lstData = this.dataAppointments.map((item: any) => ({
      start: new Date(item.appointmentDate),
      end: new Date(new Date(item.appointmentDate).getTime() + 60 * 60000),
      data: {
        id: item.appointmentID,
        name: item.customer.lastName + ' ' + item.customer.firstName,
        phoneCus: item.customer.phone,
        doctor: item.doctor == null ? '---' : item.doctor,
        spaTherapist: item.teachnicalStaff == null ? '---' : item.teachnicalStaff,
        status: {
          name: item.status,
          status: '',
          bg: '',
        },
      },
    }));

    for (const appoint of this.lstData) {
      if (appoint.data.status.name == 'Đã hẹn') {
        appoint.data.status.status = 'info'
        appoint.data.status.bg = 'bg-info-100'
      } else if (appoint.data.status.name == 'Hủy hẹn') {
        appoint.data.status.status = 'error'
        appoint.data.status.bg = 'bg-error-100'
      } else if (appoint.data.status.name == 'Chờ khám') {
        appoint.data.status.status = 'secondary'
        appoint.data.status.bg = 'bg-gray-100'
      } else if (appoint.data.status.name == 'Đang khám') {
        appoint.data.status.status = 'primary'
        appoint.data.status.bg = 'bg-info-100'
      } else if (appoint.data.status.name == 'Đã khám') {
        appoint.data.status.status = 'warning'
        appoint.data.status.bg = 'bg-warning-100'
      } else if (appoint.data.status.name == 'Không sử dụng dịch vụ') {
        appoint.data.status.status = 'error'
        appoint.data.status.bg = 'bg-error-100'
      } else if (appoint.data.status.name == 'Chờ chăm sóc') {
        appoint.data.status.status = 'secondary'
        appoint.data.status.bg = 'bg-gray-50'
      } else if (appoint.data.status.name == 'Đang chăm sóc') {
        appoint.data.status.status = 'primary'
        appoint.data.status.bg = 'bg-info-100'
      } else if (appoint.data.status.name == 'Hoàn thành') {
        appoint.data.status.status = 'warning'
        appoint.data.status.bg = 'bg-warning-100'
      } else if (appoint.data.status.name == 'Chưa thanh toán') {
        appoint.data.status.status = 'primary'
        appoint.data.status.bg = 'bg-info-100'
      } else if (appoint.data.status.name == 'Thanh toán 1 phần') {
        appoint.data.status.status = 'info'
        appoint.data.status.bg = 'bg-info-100'
      } else if (appoint.data.status.name == 'Thanh toán hoàn tất') {
        appoint.data.status.status = 'success'
        appoint.data.status.bg = 'bg-success-100'
      }
    }

  }


  onClickSegment(date: WeekViewHourSegment) {
    const modal = this.modalSvc.create({
      title: 'Tạo lịch hẹn',
      content: AppointmentModalComponent,
      footer: null,
      size: 'lg',
      componentParams: {
        formatTime: new Date(date.date as Date)
      }
    })
    modal.afterClose.asObservable().subscribe(
      (e: any) => {
        this.initAppointment();
      }
    )
  }

  clickEvent(e: MouseEvent, event: TDSSafeAny) {
    e.stopImmediatePropagation();
    e.preventDefault();
    this.lstData = this.lstData.filter((f) => f != event);
  }

  onModelChange(e: TDSSafeAny) {
    this.mode = e;
  }

  getMonthData(date: Date, event: TDSSafeAny): boolean {
    return isSameDay(date, event.start);
  }

  // Format Date & Time
  formatDate(date: string, format: string): string {
    return moment(date).format(format);
  }

  // Open Create Appointment Modal
  createAppointment() {
    const modal = this.modalSvc.create({
      title: 'Tạo lịch hẹn',
      content: AppointmentModalComponent,
      footer: null,
      size: 'lg',
    });
    modal.afterClose.asObservable().subscribe((res) => {
      if (res) {
        this.initAppointment()
      }
    });
  }

  // Open Edit Appointment Modal
  onEditAppointment(id: number) {
    const modal = this.modalSvc.create({
      title: 'Tạo dịch vụ lịch hẹn',
      content: AppointmentModalComponent,
      footer: null,
      size: 'lg',
      componentParams: {
        id,
      },
    });
    modal.afterClose.asObservable().subscribe((res) => {
      if (res) {
        this.initAppointment();
      }
    });
  }

  // Open Edit In Session Modal
  onEditInSession(id: number) {
    const modal = this.modalSvc.create({
      title: 'Edit Information',
      content: InSessionModalComponent,
      footer: null,
      size: 'lg',
      componentParams: {
        id,
      },
    });
    modal.afterClose.asObservable().subscribe((res) => {
      if (res) {
        this.initAppointment();
      }
    });
  }

  // Open Edit Payment Modal
  onEditPayment(id: number) {

    this.sharedService.getAppointment(id).subscribe(
      (data: any) => {
        const val = {
          customerID: data.customerID,
          appointmentID: id,
          date: data.appointmentDate,
          billStatus: "",
          doctor: "",
          technicalStaff: "",
          totalAmount: data.total,
          amountInvoiced: 0,
          amountResidual: data.total
        }

        this.assign = data.assignments
        const foundDoctor = this.assign.find(item => item.employees.jobTypeID === 2);
        const foundSpaTherapist = this.assign.find(item => item.employees.jobTypeID === 3);
        if (foundDoctor) {
          val.doctor = foundDoctor.employees.lastName + ' ' + foundDoctor.employees.firstName
        }

        if (foundSpaTherapist) {
          val.technicalStaff = foundSpaTherapist.employees.lastName + ' ' + foundSpaTherapist.employees.firstName
        }

        this.sharedService.createBill(val).subscribe(
          (data: any) => {
            this.sharedService.UpdateStatus(id, 'Đã thanh toán').subscribe()
            this.router.navigate(['bill/' + data.item]);
          },
          // () => {
          //   console.log(Error)
          // }
        )
      }
    )
  }

  // Update Status
  updateStatus(id: number, status: string) {
    this.sharedService.UpdateStatus(id, status).subscribe(() => {
      this.sharedService.getAppointment(id).subscribe();
      this.initAppointment();
    });
  }

  // Choose doctor
  chooseDoctor(id: number, status: string) {
    this.sharedService.getAppointment(id).subscribe((res: any) => {
      const foundDoctor = (res.assignments as any[]).find(item => item.employees.jobTypeID === 2);
      if (!foundDoctor) {
        const appointmentDate = res.appointmentDate;
        const modal = this.modalSvc.create({
          title: 'Choose Doctor',
          content: ChooseDoctorModalComponent,
          footer: null,
          size: 'md',
          componentParams: {
            id,
            appointmentDate,
          },
        });
        modal.afterClose.asObservable().subscribe((res) => {
          if (res) {
            this.updateStatus(id, status);
          }
        });
      } else {
        this.updateStatus(id, status);
      }
    });
  }

  // Open Create Appointment Modal
  createBill(id: number) {
    const modal = this.modalSvc.create({
      title: 'Tạo hóa đơn',
      content: BillModalComponent,
      footer: null,
      size: 'xl',
      componentParams: {
        id,
      },
    });
    modal.afterClose.asObservable().subscribe((res) => {
      if (res) {
        this.initAppointment()
      }
    });
  }

  createCustomer(){
    const modal = this.modalSvc.create({
      title:'Thêm khách hàng',
      content: CustomerModalComponent,
      footer:null,
      size:'lg'
    });
    modal.afterClose.asObservable().subscribe(res=>{
      if(res){
        this.initAppointment();
      }
    })
  }

  updateBill(id: number) {
    const modal = this.modalSvc.create({
      title: 'Thanh toán',
      content: PaymentModalComponent,
      footer: null,
      size: 'xl',
      componentParams: {
        id,
      },
    });
    modal.afterClose.asObservable().subscribe((res) => {
      if (res) {
        this.initAppointment()
      }
    });
  }

  getBill(id: number) {
    const modal = this.modalSvc.create({
      title: 'Xem hóa đơn',
      content: PaymentModalComponent,
      footer: null,
      size: 'xl',
      componentParams: {
        id,
      },
    });
    modal.afterClose.asObservable().subscribe((res) => {
      if (res) {
        this.initAppointment()
      }
    });
  }
}
