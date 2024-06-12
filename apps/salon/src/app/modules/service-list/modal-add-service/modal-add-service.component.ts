import { Component, inject } from '@angular/core';
import { TDSModalModule, TDSModalRef } from 'tds-ui/modal';
import { AuthService } from '../../../shared.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSInputNumberModule } from 'tds-ui/input-number';
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
    TDSModalModule
  ]
})
export class ModalAddServiceComponent {

  private auth = inject(AuthService);
  private readonly modalRef = inject(TDSModalRef)

  dolarValue = 100000.2;

  modalServiceForm = inject(FormBuilder).nonNullable.group({
    name:['',Validators.compose([
      Validators.required
    ])
    ] ,
    price:['' , Validators.compose([
      Validators.required
    ])
  ],
    description:['' , Validators.compose([
      Validators.required
    ])
  ]
    });

  handleOk(): void {
    console.log('Button ok clicked!');
    this.modalRef.destroy(true)
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.modalRef.destroy(false)
  }

  btnCreate(): void {
    if(this.modalServiceForm.invalid) return;
  }
}
