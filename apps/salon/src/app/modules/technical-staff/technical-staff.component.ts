import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TDSTableModule } from 'tds-ui/table';
import { AuthService } from '../../shared.service';
import { RouterLink } from '@angular/router';
import { TDSModalService } from 'tds-ui/modal';
import { TreatmentDetailComponent } from './treatment-detail/treatment-detail.component';
import { TDSNotificationService } from 'tds-ui/notification';

@Component({
  selector: 'frontend-technical-staff',
  templateUrl: './technical-staff.component.html',
  styleUrls: ['./technical-staff.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TDSTableModule, RouterLink],
})
export class TechnicalStaffComponent {
  listSpaServiceQueue: any[] = [];
  customerDetail?: any = [] || null;
  appointmentAllInfo?: any;
  private readonly tModalSvc = inject(TDSModalService);
  selectedFiles: File[] = [];
  checkboxStatess: { [key: number]: boolean } = {};
  dataTemp: any;
  urls = [];

  ngOnInit(): void {
    this.renderCustomerInQueue();
  }

  constructor(
    private auth: AuthService,
    private notification: TDSNotificationService
  ) { }

  renderCustomerInQueue() {
    this.auth
      .getCustomerInQueueForTechnicalStaff(1, 'Treatment')
      .subscribe((x: any[]) => {
        this.listSpaServiceQueue = x;
        console.log(this.listSpaServiceQueue);
      });
  }

  renderCustomerDetail(data: any) {
    const observer = {
      next: (data: any) => {
        this.checkboxStatess = {};
        this.loadData()
        this.appointmentAllInfo = data;
        this.customerDetail = data.ChooseServices.map(
          (chooseService: any) => chooseService.service
        );
        console.log(this.listSpaServiceQueue);
        // this.listSpaServiceQueue.forEach((service: any) => {
        //   this.checkboxStates[data.AppointmentID] = {
        //     state: false,
        //     serviceID: service.serviceID,
        //   }; // Default state is unchecked
        // });
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

    this.auth.getAppointmentById(data.AppointmentID).subscribe(observer);
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
    // console.log(this.listSpaServiceQueue)
    // this.modalSvc.create({
    //   title: 'Hồ sơ',
    //   content: UserProfileComponent,
    //   footer: null,
    //   size: 'lg',
    //   componentParams: {
    //     customerId: this.dataParent.CustomerID
    //   }
    // })
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
    this.loadData();
  }

  loadData() {
    const data: any = localStorage.getItem('appointmentDetail');
    this.dataTemp = JSON.parse(data);
    console.log(this.dataTemp);
  }

}
