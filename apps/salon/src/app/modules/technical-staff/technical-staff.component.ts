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
  private readonly tModalSvc = inject(TDSModalService)
  selectedFile: File | null = null;
  checkboxStatess: { [key: number]: boolean } = {};
  checkboxStates: { [key: number]: { state: boolean, serviceID: number } } = {};

  ngOnInit(): void {
    this.renderCustomerInQueue();
  }

  constructor(private auth: AuthService, private notification: TDSNotificationService) { }

  renderCustomerInQueue() {
    this.auth
      .getCustomerInQueueForTechnicalStaff(1, 'Treatment')
      .subscribe((x: any[]) => {
        this.listSpaServiceQueue = x
        console.log(this.listSpaServiceQueue)
      });
  }

  renderCustomerDetail(data: any) {
    const observer = {
      next: (data: any) => {
        this.appointmentAllInfo = data;
        this.customerDetail = data.ChooseServices.map((chooseService: any) => chooseService.service);
        console.log(this.listSpaServiceQueue);
        this.listSpaServiceQueue.forEach((service: any) => {
          this.checkboxStates[data.AppointmentID] = { state: false, serviceID: service.serviceID }; // Default state is unchecked
        });
        console.log(this.checkboxStates);
        console.log(data);
        console.log(this.appointmentAllInfo);

        for (const key in this.checkboxStates) {
          this.checkboxStates[key] = this.checkboxStates[key] || false
        }

        for (const key in this.checkboxStates) {
          if (this.checkboxStates[key]) {
            this.checkboxStates[key].state = this.checkboxStates[key].state || false;
          }
        }
        // this.dataParent
      },
      error: (err: any) => console.error('Observer got an error: ' + err),
      complete: () => console.log('Observer got a complete notification'),
    };

    this.auth
      .getAppointmentById(data.AppointmentID)
      .subscribe(observer);
  }

  //
  detailCustomerModelForStaff(data: any) {
    // const modal = this.tModalSvc.create({
    //   title: 'Thông tin khách hàng',
    //   content: TreatmentDetailComponent,
    //   footer: null,
    //   size: 'lg',
    //   componentParams: {
    //     dataParent: data
    //   }
    // });
    // modal.afterClose.asObservable().subscribe(
    //   res => {
    //     if (res) {
    //       this.listSpaServiceQueue = [...this.listSpaServiceQueue.map((item: any) => {
    //         if (item.AppointmentID === data.AppointmentID) {
    //           return { ...item, ...res }
    //         }
    //         return item
    //       })]
    //       // this.renderCustomerInQueue()
    //     }
    //   })
  }

  uploadImage() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('id', this.listSpaServiceQueue.toString());

      this.auth.UploadImageCustomer(formData).subscribe(
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
    this.selectedFile = event.target.files[0];
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

  toggleCheckbox(appointmentID: number, serviceID: number) {
    console.log(serviceID);
    if (this.checkboxStates[appointmentID]) {
      this.checkboxStates[appointmentID].state = !this.checkboxStates[appointmentID].state;
      this.checkboxStates[appointmentID].serviceID = serviceID;
    }
    console.log(this.checkboxStates);
    this.onSave(this.checkboxStates)
  }

  onSave(checkboxStates: any) {
    this.checkboxStates = checkboxStates;
  }


}
