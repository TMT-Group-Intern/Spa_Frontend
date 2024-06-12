import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSModalModule, TDSModalRef } from 'tds-ui/modal';
import { AuthService } from '../../../services/auth.service';
import { ModalAddServiceComponent } from '../modal-add-service/modal-add-service.component';
import { number } from 'echarts';

@Component({
  selector: 'frontend-modal-del-service',
  templateUrl: './modal-del-service.component.html',
  styleUrls: ['./modal-del-service.component.scss'],
  standalone: true,
  imports:[CommonModule,
    ReactiveFormsModule,
    TDSButtonModule,
    TDSModalModule
  ]
})
export class ModalDelServiceComponent implements OnInit  {

  @Input() id? : number;

  private modalRef = inject(TDSModalRef);
  private auth = inject(AuthService);


  ngOnInit(): void {
      console.log(this.id);
  }


  handleCancel(): void {
    this.modalRef.destroy(null)
   }

   btnDeleteService()
   {
    if(this.id == null) return;

    this.auth.deleteAService(this.id).subscribe(
      (data) => {
        console.log(data);
      },
      (e) => {
        console.log(e);
      },
      () =>{
        this.handleCancel();
      }
    )
   }
}
