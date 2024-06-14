import { Component, Input, OnInit, inject } from '@angular/core';
import { TDSModalModule, TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { AuthService } from '../../../shared.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSInputNumberModule } from 'tds-ui/input-number';
import { TDSNotificationModule, TDSNotificationService } from 'tds-ui/notification';
import { number } from 'echarts';
import { title } from 'process';
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;


@Component({
  selector: 'frontend-modal-service',
  templateUrl: './modal-service.component.html',
  styleUrls: ['./modal-service.component.scss'],
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
export class ModalServiceComponent implements OnInit{
  @Input() id? : number;
  private readonly modalService = inject(TDSModalService)
  constructor(
    private auth: AuthService,
    private readonly modalRef: TDSModalRef,
  ){}


  // Kiểm tra dữ liệu input và báo lỗi rỗng
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
    if(this.id){
      this.auth.getByIdService(this.id).subscribe(
        (data:any)=>{
          this.modalServiceForm.patchValue(data.serviceDTO);
        }
      )
    }
  }

  // Nhấn x thoát modal
  handleCancel(): void {
    this.modalRef.destroy(null)
  }

  // Button Submit lựa chọn thực thi hàm với điều kiện id
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

   // Tạo Service
   btnCreateService(val: any): void{
    this.auth.createService(val).subscribe(
      (data) =>{
        this.modalService.success({
          title: 'Successfully!',
          okText: 'OK'
        })
        this.modalRef.destroy(data)
      },
      (ex) => {
        this.modalService.error({
            title: 'Error!',
            content: ex.error.message,
            okText: 'OK'
          });
      },
    );
   }

   // Sửa service
   btnEditService(id: number ,val: any): void{
    this.auth.editService(id,val).subscribe(
      (data) =>{
        this.modalService.success({
          title: 'Successfully!',
          okText: 'OK'
        })
        this.modalRef.destroy(data);
      },
      (ex) => {
        this.modalService.error({
          title: 'Error!',
          content: ex.error.message,
          okText: 'OK'
        });
      },
    );
   }

}
