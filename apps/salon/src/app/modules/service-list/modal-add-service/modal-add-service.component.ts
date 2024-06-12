import { Component, Input, OnInit, inject } from '@angular/core';
import { TDSModalModule, TDSModalRef } from 'tds-ui/modal';
import { AuthService } from '../../../shared.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSInputNumberModule } from 'tds-ui/input-number';
import { TDSNotificationModule, TDSNotificationService } from 'tds-ui/notification';
import { ServiceListComponent } from '../service-list.component';
import { number } from 'echarts';
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
export class ModalAddServiceComponent implements OnInit{
  @Input() id? : number;

  constructor(
    private auth: AuthService,
    private notifications: TDSNotificationService,
    private readonly modalRef: TDSModalRef,
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

  ngOnInit(): void {
    console.log(this.id)
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.modalRef.destroy(null)
  }

  btnSubmitService(){
    if(this.modalServiceForm.invalid) return;
    const val = {
      ...this.modalServiceForm.value
    };

    if(this.id){
      this.btnEditService(this.id, val);
    } else{
      this.btnCreateService(val);
    }
   }

   btnCreateService(val: any): void{
    this.auth.createService(val).subscribe(
      () =>{
        console.log(val);
        this.createNotificationSuccess();
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

   btnEditService(id: number ,val: any): void{
    this.auth.editService(id,val).subscribe(
      () =>{
        console.log(id,"-",val);
        this.createNotificationSuccess();
      },
      () => {
        console.log(id,"-",val);
        this.createNotificationError();
      },
      () => {
        this.handleCancel();
      }
    );
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
