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
import { concatMap, filter, tap } from 'rxjs';
import { TDSCheckboxChange, TDSCheckBoxModule } from 'tds-ui/tds-checkbox';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { TDSTabsModule } from 'tds-ui/tabs';
import { TreatmentPlanComponent } from '../treatment-plan/treatment-plan.component';
import { TreatmentPlanModule } from '../treatment-plan/treatment-plan.module';
import { updateValidator } from '@core/funcs';

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
    TDSCheckBoxModule,
    UserProfileComponent,
    TDSTabsModule,
    TreatmentPlanModule,
  ],
})
export class DoctorComponent implements OnInit {
  public statusOptions = [
    // 'Chờ khám',
    // 'Đang khám',
    'Đã khám',
    'Không sử dụng dịch vụ',
  ];
  @Input() id?: number;
  private readonly notification = inject(TDSNotificationService);
  private readonly sharedService = inject(AuthService);
  reception: any[] = [];
  active?: boolean;
  appointmentList: any[] = [];
  serviceHistory: any;
  fallback = './assets/img/default.svg';
  dataAppointmentbyid: any;
  today = startOfToday();
  empID: any[] = [];
  dataSvc: any = [];
  CustomerID: number | undefined;
  userSession: any;
  companyId: number | null = null;
  branchID: any;
  getServiceId: any;
  appointments: any[] = [];
  // sessionID: any;
  serviceBefore: any;
  chooseTreatment: any
  // isNote = false

  form = inject(FormBuilder).nonNullable.group({
    customerID: [],
    name: [''],
    branch: [''],
    phone: ['', [Validators.required, Validators.pattern(/^[0]{1}[0-9]{9}$/)]],
    employeeID: [[0]],
    assignments: [[]],
    doctor: [''],
    appointmentDate: ['', Validators.required],
    status: ['Đã khám'],
    service: [[], Validators.required],
    note: [''],
  });
  constructor(private companySvc: CompanyService) { }

  ngOnInit(): void {
    this.sharedService.DataListenerDoctorChagneStatus(
      this.onReceiveAppointments.bind(this)
    );

    const storedUserSession = localStorage.getItem('userSession');
    if (storedUserSession !== null) {
      this.userSession = JSON.parse(storedUserSession);
    }
    this.initAppointmentList();

    this.companySvc._companyIdCur$
      .pipe(
        filter((companyId) => !!companyId),
        concatMap((branchID) => {
          return this.sharedService.appointmentList(branchID as number);
        })
      )
      .subscribe((data: any) => {
        this.appointmentList = data;
        this.branchID = data[0].branchID;
        this.reception = this.appointmentList.filter(
          (appointment: any) =>
            (appointment.status === 'Chờ khám' ||
              appointment.status === 'Đang khám') &&
            (appointment.employeeCode === this.userSession.user.userCode ||
              this.userSession.user.role === 'Admin')
        );
        const foundExamingAppoint = this.appointmentList.find(
          (item) => item.status == 'Đang khám'
        );
        if (foundExamingAppoint) {
          this.userFrofile(foundExamingAppoint.appointmentID);
        }
      });


    // theo dõi thay đổi serviceId
    this.companySvc._change_service$.subscribe((data) => {
      if (this.form.value.status != 'Không sử dụng dịch vụ') {
        // Lấy giá trị hiện tại của service, nếu null hoặc undefined thì gán nó là mảng trống
        const currentService = this.form.value.service ?? [];

        // Chuyển đổi các mảng hiện tại và mới thành Set để loại bỏ các giá trị trùng lặp
        const updatedServiceSet = new Set([...currentService, ...(Array.isArray(data) ? data : [data])]);

        // Chuyển đổi Set thành mảng để cập nhật lại giá trị của service
        const updatedService = Array.from(updatedServiceSet);

        // Cập nhật lại giá trị của service bằng patchValue
        this.form.patchValue({
          service: updatedService as unknown as undefined
        });
        this.serviceBefore = data;
      }
    });
    this.companySvc._change_session_status$.subscribe((data) => {
      if (this.form.value.status != 'Không sử dụng dịch vụ') this.chooseTreatment = (Array.isArray(data) ? data : [data]);
      console.log(this.chooseTreatment)
    });
  }

  //
  isCheck(event:TDSCheckboxChange) {
    if (event.checked) {
      this.form.patchValue({
        status: 'Không sử dụng dịch vụ',
        service: undefined,
      });
      this.form.get('service')?.disable();
    } else {
      this.form.patchValue({
        status: 'Đã khám',
      });
      this.form.get('service')?.enable();
    }

    updateValidator(event.checked, this.form, {
      field: 'note',
      validators: [Validators.required],
      state: 'setErrors',
    });
  }

  //
  // note() {
  //   if (this.form.value.note == '' && this.form.value.status == 'Không sử dụng dịch vụ') {
  //     this.isNote = true
  //   } else {
  //     this.isNote = false
  //   }
  // }

  //
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
    const branchID = this.userSession.user.branchID;
    this.sharedService.appointmentList(branchID).subscribe((data: any) => {
      this.appointmentList = data;
      this.reception = this.appointmentList.filter(
        (appointment: any) =>
          (appointment.status === 'Chờ khám' ||
            appointment.status === 'Đang khám') &&
          (appointment.employeeCode === this.userSession.user.userCode ||
            this.userSession.user.role === 'Admin')
      );
    });
  }

  userFrofile(id: number) {
    this.sharedService
      .getAppointment(id)
      .pipe(
        tap((data: any) => {
          this.dataAppointmentbyid = data;
          this.active = true;
          this.CustomerID = data.customerID;
          this.form.patchValue({
            phone: data.customer.phone,
            name: `${data.customer.firstName} ${data.customer.lastName}`,
            appointmentDate: this.formatDate(data.appointmentDate, 'HH:mm'),
            customerID: data.customer.customerID,
            // status: data.status,
            service: data.chooseServices.map((item: any) => item.serviceID),
            note: data.notes,
          });
          const foundDoctor = (data.assignments as any[]).find(
            (item) => item.employees.jobTypeID === 2
          );
          if (foundDoctor) {
            this.form.patchValue({
              doctor: `${foundDoctor.employees.lastName} ${foundDoctor.employees.firstName}`,
            });
          }
        }),
        concatMap(() =>
          this.sharedService.appointmentList(this.branchID).pipe(
            tap((dataAllAppoint: any[]) => {
              const foundExamingAppoint = dataAllAppoint.find(
                (item) => item.status == 'Đang khám'
              );
              if (foundExamingAppoint) {
                if (foundExamingAppoint.appointmentID != id) {
                  this.sharedService
                    .UpdateStatus(foundExamingAppoint.appointmentID, 'Chờ khám')
                    .pipe(
                      concatMap(() =>
                        this.sharedService.UpdateStatus(id, 'Đang khám').pipe(
                          tap(() => {
                            this.initAppointmentList();
                          })
                        )
                      )
                    )
                    .subscribe();
                }
              } else {
                this.sharedService
                  .UpdateStatus(id, 'Đang khám')
                  .pipe(
                    tap(() => {
                      this.initAppointmentList();
                    })
                  )
                  .subscribe();
              }
            })
          )
        )
      )
      .subscribe();
    this.initService();
  }

  submitUpdateServiceAppointment(id: number) {
    // if (this.form.value.status == 'Đã khám') {
    //   if (this.form.invalid) return;
    // }
    if (this.form.invalid) return;

    const currentService = this.form.value.service ?? [];
    this.chooseTreatment = this.chooseTreatment.filter((item1: any) => currentService.some(item2 => item1.serviceID === item2))
    const currentTreatment = (this.chooseTreatment as any[]).map(item => ({
      appointmentID: this.dataAppointmentbyid.appointmentID,
      treatmentDetailID: item.treatmentDetailID,
      qualityChooses: item.quantity
    }))
    // console.log(this.chooseTreatment)
    // console.log(currentTreatment)

    const chooseService = currentService.filter(item1 => this.chooseTreatment.some((item2: any) => item1 !== item2.serviceID))
    // console.log(chooseService)

    const val = {
      ...this.form.value,
      service: chooseService,
      chooseTreatment: currentTreatment
    };




    this.updateServiceAppointment(id, val.status, val.service, val.note, val.chooseTreatment);

    // if (id && this.form.value.status != 'Không sử dụng dịch vụ') {
    //   // this.updateServiceAppointment(id, val.status, val.service, val.note);
    //   console.log(1)
    // } else {
    //   console.log(2)
    //   if(this.form.value.note == '') {
    //     this.isNote = true
    //     return
    //   }
    //   this.isNote = false
    //   // this.updateServiceAppointment(id, val.status, val.service, val.note);
    // }
  }

  // Update service Appointment
  updateServiceAppointment(
    id: number,
    status: any,
    listServiceID: any,
    notes: any,
    chooseServiceTreatmentDTO: any
  ) {
    this.sharedService
      .updateAppointmentWithService(id, { listServiceID, status, notes, chooseServiceTreatmentDTO })
      .subscribe({
        next: () => {
          this.createNotificationSuccess('');
          this.initAppointmentList();
          if (status === 'Đã khám' || status === 'Không sử dụng dịch vụ')
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
    console.log('hehe');
  }
}
