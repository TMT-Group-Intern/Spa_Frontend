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
import { concatMap, filter } from 'rxjs';

@Component({
  selector: 'frontend-technical-staff',
  templateUrl: './technical-staff.component.html',
  styleUrls: ['./technical-staff.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TDSTableModule, RouterLink, TDSFormFieldModule, TDSSelectModule],
})
export class TechnicalStaffComponent {
  private readonly modalSvc = inject(TDSModalService)
  listSpaServiceQueue: any[] = [];
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
  companyId: number | null = null;
  //count:number = 0;
  public statusOptions = [
    'Hẹn',
    'Hủy hẹn',
  ]
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
    const storedUserSession = localStorage.getItem('userSession');
    if (storedUserSession !== null) {
      this.userSession = JSON.parse(storedUserSession);
      this.currentBranch = this.userSession.user.branchID;
      this.renderCustomerInQueue();
    }

    this.companySvc._companyIdCur$.pipe(
      filter(companyId => !!companyId),
      concatMap((branchID) => {
        this.currentBranch = branchID
        return this.auth.getCustomerInQueueForTechnicalStaff(branchID as number, 'Đang làm')
      })
    ).subscribe((x: any[]) => {
      this.listSpaServiceQueue = x;
      console.log(this.listSpaServiceQueue)
      this.auth
        .getCustomerInQueueForTechnicalStaff(this.currentBranch as number, 'Chờ làm')
        .subscribe((x: any[]) => {
          this.listSpaServiceQueue = [...this.listSpaServiceQueue, ...x];
          console.log(this.listSpaServiceQueue)
        });
    });
  }

  constructor(
    private auth: AuthService,
    private notification: TDSNotificationService,
    private companySvc: CompanyService
  ) { }

  renderCustomerInQueue() {
    this.auth
      .getCustomerInQueueForTechnicalStaff(this.userSession.user.branchID, 'Đang làm')
      .subscribe((x: any[]) => {
        this.listSpaServiceQueue = x;
        this.auth
          .getCustomerInQueueForTechnicalStaff(this.userSession.user.branchID, 'Chờ làm')
          .subscribe((x: any[]) => {
            this.listSpaServiceQueue = [...this.listSpaServiceQueue, ...x];
          });
      });
    console.log(this.listSpaServiceQueue);
  }

  renderCustomerDetail(data: any) {
    const observer = {
      next: (data: any) => {
        this.checkActive = true;
        this.checkboxStatess = {};
        this.loadData()
        this.appointmentAllInfo = data;
        console.log(this.appointmentAllInfo)
        this.customerDetail = data.ChooseServices.map(
          (chooseService: any) => chooseService.service
        );
        console.log(this.listSpaServiceQueue);
        console.log(this.dataTemp);
        const appointmentData = this.dataTemp.find((item: any) => item.data.AppointmentID === this.appointmentAllInfo.AppointmentID);
        if (appointmentData) {
          Object.keys(appointmentData.checkBox).forEach(key => {
            const numKey = +key;
            if (!isNaN(numKey)) {
              this.checkboxStatess[numKey] = appointmentData.checkBox[numKey] || false;
            }
          });
        }
      },
      error: (err: any) => console.error('Observer got an error: ' + err),
      complete: () => console.log('Observer got a complete notification'),
    };

    this.auth.getAppointment(data.AppointmentID).subscribe(observer);
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
        customerId: this.appointmentAllInfo.CustomerID
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

  toggleCheckbox(serviceId: number) {
    this.checkboxStatess[serviceId] = !this.checkboxStatess[serviceId];
    console.log(this.checkboxStatess);
  }

  onSave(data: any, checkBox: any) {
    const appointmentDetailList = JSON.parse(localStorage.getItem('appointmentDetail') || '[]');
    const existingIndex = appointmentDetailList.findIndex((item: any) => item.data.AppointmentID === data.AppointmentID);
    const checkboxTemp: { [key: number]: boolean } = {};
    if (existingIndex !== -1) {
      const existingCheckBox = appointmentDetailList[existingIndex].checkBox;

      for (const key in existingCheckBox) {
        checkboxTemp[Number(key)] = existingCheckBox[key];
      }
      for (const key in checkBox) {
        checkboxTemp[Number(key)] = checkBox[key];
      }
      appointmentDetailList[existingIndex].checkBox = checkboxTemp;
    } else {
      appointmentDetailList.push({ data, checkBox });
    }
    localStorage.setItem('appointmentDetail', JSON.stringify(appointmentDetailList));
    this.createNotificationSuccess('Upload successful');
    this.loadData();

  }

  loadData() {
    const data: any = localStorage.getItem('appointmentDetail');
    this.dataTemp = JSON.parse(data);
    console.log(this.dataTemp);

  }

  onStatusChange(event: any, id: number) {
    const status = event.target.value;
    if (status === 'Hoàn thành') {
      this.onDelete(id);
      this.checkActive = false;

    }
    this.updateStatus(id, status);
  }

  updateStatus(id: number, status: string) {
    this.auth.UpdateStatus(id, status).subscribe(
      () => {
        this.listSpaServiceQueue = [];
        this.renderCustomerInQueue();
      },
      (error) => {
        console.error('Error updating status:', error);
        // Handle error (if needed)
        this.renderCustomerInQueue();
      }
    );
  }

  onDelete(appointmentID: number) {
    const appointmentDetailList = JSON.parse(localStorage.getItem('appointmentDetail') || '[]');
    const updatedList = appointmentDetailList.filter((item: any) => item.data.AppointmentID !== appointmentID);
    localStorage.setItem('appointmentDetail', JSON.stringify(updatedList));
    this.loadData();
  }


  start(): void {
    this.timer = true;
    this.stopWatch();
  }

  stop(): void {
    this.timer = false;
  }

  reset(): void {
    this.timer = false;
    this.hour = 0;
    this.minute = 0;
    this.second = 0;
    this.count = 0;
    this.updateDisplay();
  }

  stopWatch(): void {
    if (this.timer) {
      this.count++;

      if (this.count == 100) {
        this.second++;
        this.count = 0;
      }

      if (this.second == 60) {
        this.minute++;
        this.second = 0;
      }

      if (this.minute == 60) {
        this.hour++;
        this.minute = 0;
        this.second = 0;
      }

      this.updateDisplay();

      setTimeout(() => this.stopWatch(), 10);
    }
  }

  updateDisplay(): void {
    this.hrString = this.hour < 10 ? '0' + this.hour : this.hour.toString();
    this.minString = this.minute < 10 ? '0' + this.minute : this.minute.toString();
    this.secString = this.second < 10 ? '0' + this.second : this.second.toString();
    this.countString = this.count < 10 ? '0' + this.count : this.count.toString();
  }


}
