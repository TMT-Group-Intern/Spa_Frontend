import { Component, Input, OnChanges, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSModalModule, TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { AuthService } from '../../../shared.service';
import { FormsModule } from '@angular/forms';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSNotificationService } from 'tds-ui/notification';
import { log } from 'console';
import { UserProfileComponent } from '../../user-profile/user-profile.component';

@Component({
  selector: 'frontend-treatment-detail',
  standalone: true,
  imports: [
    CommonModule,
    TDSModalModule,
    FormsModule,
    TDSButtonModule
  ],
  templateUrl: './treatment-detail.component.html',
  styleUrls: ['./treatment-detail.component.scss'],
})
export class TreatmentDetailComponent implements OnInit {

  private readonly modalSvc = inject(TDSModalService)

  listSpaServiceQueue: any = [];
  constructor(private auth: AuthService, private modalRef: TDSModalRef, private notification: TDSNotificationService) { }
  @Input() dataParent?: any;
  // @Input() id?: number;
  checkboxStates: { [key: number]: boolean } = {};
  selectedFile: File | null = null;


  ngOnInit(): void {
    this.renderCustomerDetail();
  }


  renderCustomerDetail() {
    const observer = {
      next: (data: any) => {
        this.listSpaServiceQueue = data.ChooseServices.map((chooseService: any) => chooseService.service);
        console.log(this.listSpaServiceQueue);
        this.listSpaServiceQueue.forEach((service: any) => {
          this.checkboxStates[service.ServiceID] = false; // Default state is unchecked
        });
        console.log(this.checkboxStates);
        console.log(this.dataParent);

        for (const key in this.checkboxStates) {
          this.checkboxStates[key] = this.dataParent[key] || false
        }

        // this.dataParent
      },
      error: (err: any) => console.error('Observer got an error: ' + err),
      complete: () => console.log('Observer got a complete notification'),
    };

    this.auth
      .getAppointment(this.dataParent.AppointmentID as number)
      .subscribe(observer);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  callModalHistory() {
    console.log(this.dataParent.CustomerID)
    this.modalSvc.create({
      title: 'Hồ sơ',
      content: UserProfileComponent,
      footer: null,
      size: 'lg',
      componentParams: {
        customerId: this.dataParent.CustomerID
      }

    })
  }

  uploadImage() {
    // if (this.selectedFile) {
    //   const formData = new FormData();
    //   formData.append('file', this.selectedFile);
    //   formData.append('id', this.dataParent.AppointmentID.toString());

    //   this.auth.UploadImageCustomer(formData).subscribe(
    //     () => {
    //       this.createNotificationSuccess('Upload successful');
    //     },
    //     (res) => {
    //       this.createNotificationError(res.error.message);
    //     }
    //   );
    // } else {
    //   this.createNotificationError('No file selected');
    // }
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


  toggleCheckbox(serviceId: number) {
    this.checkboxStates[serviceId] = !this.checkboxStates[serviceId];
    console.log(this.checkboxStates);
  }

  onSave() {
    this.modalRef.destroy(this.checkboxStates)
  }


}
