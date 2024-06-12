import { Component, OnInit, inject } from '@angular/core';
import { TDSModalModule, TDSModalRef } from 'tds-ui/modal';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSInputNumberModule } from 'tds-ui/input-number';
import { TDSNotificationModule, TDSNotificationService } from 'tds-ui/notification';
import { ServiceListComponent } from '../service-list.component';
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;


@Component({
  selector: 'frontend-modal-add-service',
  templateUrl: './modal-add-service.component.html',
  styleUrls: ['./modal-add-service.component.scss'],
  standalone:true,
  imports:[
    CommonModule,
    ReactiveFormsModule,
    TDSFormFieldModule,
    TDSButtonModule,
    TDSInputModule,
    TDSInputNumberModule,
    TDSModalModule,
    TDSNotificationModule,
  ]
})
export class ModalAddServiceComponent{

  constructor(
    private auth: AuthService,
    private notifications: TDSNotificationService,
    private readonly modalRef: TDSModalRef,
    private callbackShowService: ServiceListComponent
  ){}

  modalServiceForm = inject(FormBuilder).nonNullable.group({
    serviceName:['',Validators.compose([
      Validators.required
    ])
    ] ,
    description:['' , Validators.compose([
      Validators.required
    ])
  ],
    price:[0 , Validators.compose([
      Validators.required,
    ])
  ]
})

  handleOk(): void {
    console.log('Button ok clicked!');
    this.modalRef.destroy(true)
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.modalRef.destroy(false)
  }

  btnSubmitService(){
    if(this.modalServiceForm.invalid) return;
    const val = {
      ...this.modalServiceForm.value
    };

    this.auth.createService(val).subscribe(
      () =>{
        console.log(val);
        this.createNotificationSuccess();
        this.callbackShowService.showServiceList();
      },
      () => {
        console.log(val);
        this.createNotificationError();
      },
      () => {
        this.handleCancel();
      }
    );

   }

   btnCreateService(): void{
    return
   }

   btnEditService(): void{
    return
   }

   btnDeleteService(): void{
    return
   }

   createNotificationSuccess(): void {
    this.notifications.success(
        'Successfully!',
        ''
    );
  }

  createNotificationError(): void {
    this.notifications.error(
        'Error',
        ''
    );
  }
}
