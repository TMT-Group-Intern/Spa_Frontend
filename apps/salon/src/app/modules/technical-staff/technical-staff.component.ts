import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TDSTableModule } from 'tds-ui/table';
import { AuthService } from '../../shared.service';
import { RouterLink } from '@angular/router';
import { TDSModalService } from 'tds-ui/modal';
import { TreatmentDetailComponent } from './treatment-detail/treatment-detail.component';
import { TDSNotificationService } from 'tds-ui/notification';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSSelectModule } from 'tds-ui/select';
import { CompanyService } from '../../core/services/company.service';
import { concatMap, filter, forkJoin, tap } from 'rxjs';
import { TDSEmptyModule } from 'tds-ui/empty';

@Component({
  selector: 'frontend-technical-staff',
  templateUrl: './technical-staff.component.html',
  styleUrls: ['./technical-staff.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TDSTableModule,
    RouterLink,
    TDSFormFieldModule,
    TDSSelectModule,
    TDSEmptyModule,
  ],
})
export class TechnicalStaffComponent {
  // public options = [
  //   { id: 'Chờ chăm sóc', name: 'Chờ chăm sóc' },
  //   { id: 'Đang chăm sóc', name: 'Đang chăm sóc' },
  //   { id: 'Hoàn thành', name: 'Hoàn thành' },
  // ]
  private readonly modalSvc = inject(TDSModalService)
  listSpaServiceQueue: any[] = [];
  reception: any[] = [];
  listWait: any[] = [];
  customerDetail?: any = [] || null;
  appointmentAllInfo: any | null = null;
  private readonly tModalSvc = inject(TDSModalService);
  selectedFiles: File[] = [];
  checkboxStatess: { [key: number]: boolean } = {};
  dataTemp: any;
  urls = [];
  userSession: any
  checkActive?: boolean = false;
  status!: FormControl;
  currentBranch: number | null = null;


  timer = false;
  hour = 0;
  minute = 0;
  second = 0;
  count = 0;

  hrString = '00';
  minString = '00';
  secString = '00';
  countString = '00';
  //count:number = 0;


  ngOnInit(): void {
    this.auth.DataListenerDoctorChagneStatus(this.onReceiveAppointments.bind(this));
    const storedUserSession = localStorage.getItem('userSession');
    if (storedUserSession !== null) {
      this.userSession = JSON.parse(storedUserSession);
      this.currentBranch = this.userSession.user.branchID;
      this.renderCustomerInQueue();
    }
    this.companySvc._companyIdCur$.pipe(
      filter(companyId => !!companyId),
      tap((company) => company)
    ).subscribe((id) => {
      this.renderCustomerInQueueTemp(id)
    });
  }

  constructor(
    private auth: AuthService,
    private notification: TDSNotificationService,
    private companySvc: CompanyService
  ) { }

  onReceiveAppointments(): void {
    this.renderCustomerInQueue();
  }

  renderCustomerInQueue() {
    forkJoin([
      this.auth.getCustomerInQueueForTechnicalStaff(this.userSession.user.branchID, 'Đang chăm sóc'),
      this.auth.getCustomerInQueueForTechnicalStaff(this.userSession.user.branchID, 'Chờ chăm sóc')
    ]).subscribe(([x, y]: [any[], any[]]) => {
      // Kết hợp tất cả phần tử từ hai API
      this.listSpaServiceQueue = [...x, ...y];

      // Lọc danh sách theo điều kiện 'spaTherapist' và 'Admin'
      this.reception = this.listSpaServiceQueue.filter(
        (appointment: any) =>
          appointment.spaTherapist === this.userSession.user.userCode ||
          this.userSession.user.role === 'Admin'
      );
    });
  }

  renderCustomerInQueueTemp(id: number | null) {
    this.auth
      .getCustomerInQueueForTechnicalStaff(id as number, 'Đang chăm sóc')
      .subscribe((x: any[]) => {
        this.listSpaServiceQueue = x;
        this.auth
          .getCustomerInQueueForTechnicalStaff(id as number, 'Chờ chăm sóc')
          .subscribe((y: any[]) => {
            this.listSpaServiceQueue = [...this.listSpaServiceQueue, ...y];
          });
      });
  }

  renderCustomerDetail(data: any) {
    const observer = {
      next: (data: any) => {
        this.checkActive = true;
        this.appointmentAllInfo = data;
      },
    };
    this.auth.getAppointment(data.appointmentID).subscribe(observer);
  }

  uploadImage(id: number) {
    if (this.selectedFiles.length > 0) {
      const formData = new FormData();
      for (const file of this.selectedFiles) {
        formData.append('files', file);
      }

      //formData.append('id', this.listSpaServiceQueue.toString());

      this.auth.UploadImageCustomer(id, formData).subscribe(
        () => {
          this.createNotificationSuccess('Upload successful');
        },
        (res) => {
          this.createNotificationError(res.error.message);
        }
      );
    } else {
      this.createNotificationError('No file selected');
    }
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input && input.files) {
      const files = Array.from(input.files);
      this.selectedFiles = files;

      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.readAsDataURL(files[i]);

        reader.onload = (e) => {
          const target = e.target as FileReader;
          const result = target.result;
          if (typeof result === 'string') {
            this.urls.push(result as never);
          }
        };
      }
    }
  }

  callModalHistory() {
    //console.log(this.dataParent.CustomerID)
    this.modalSvc.create({
      title: 'Hồ sơ',
      content: UserProfileComponent,
      footer: null,
      size: 'lg',
      componentParams: {
        customerId: this.appointmentAllInfo.customerID
      }
    })
  }

  // Success Notification
  createNotificationSuccess(content: any): void {
    this.notification.success('Succesfully', content);
  }

  // Error Notification
  createNotificationError(content: any): void {
    this.notification.error('Error', content);
  }

  onStatusChange(event: any, id: number) {
    const status = event.target.value;
    if (status === 'Hoàn thành') {
      this.checkActive = false;

    }
    this.updateStatus(id, status);
  }

  updateStatus(id: number, status: string) {
    this.auth.UpdateStatus(id, status).subscribe(
      () => {
        //  this.listSpaServiceQueue = [];
        // this.renderCustomerInQueue();
      },
      (error) => {
        console.error('Error updating status:', error);
        // Handle error (if needed)
      }
    );
  }

}
