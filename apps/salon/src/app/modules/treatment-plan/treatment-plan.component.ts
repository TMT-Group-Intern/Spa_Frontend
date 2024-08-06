import { Component, inject, Input, OnInit, TemplateRef } from '@angular/core';
import { TDSModalService } from 'tds-ui/modal';
import { ModalTreatmentPlanComponent } from './modal-treatment-plan/modal-treatment-plan.component';
import { AuthService } from '../../shared.service';

@Component({
  selector: 'frontend-treatment-plan',
  templateUrl: './treatment-plan.component.html',
  styleUrls: ['./treatment-plan.component.scss'],
})
export class TreatmentPlanComponent implements OnInit {
  @Input() idCustomer?:number;

  @Input() customerId?: number;
  private readonly modalSvc = inject(TDSModalService)
  listOfData: any[] = []
  treatment: any[] = []

  constructor (
    private shared: AuthService
  ) {}

  ngOnInit(): void {
    if(this.customerId) {
      this.shared.getTreatmentOfCustomer(this.customerId).subscribe(
        (data) => {
          this.listOfData = data
          console.log(this.listOfData)
        }
      )
    }
  }

  // Sử dụng modal
  modalTreatmentPlan():void{
    const modal = this.modalSvc.create({
      title:'Tạo lộ trình điều trị',
      content:ModalTreatmentPlanComponent,
      okText:'Xác nhận',
      footer: null,
      size:'lg',
      componentParams:{
        customerId: this.idCustomer
      }
    })
  }

  //
  treatmentExpand(event: any) {
    console.log(event)
  }

  //
  treatmentDetail(event: any) {
    console.log(event)
    // console.log(event.expand)
    // console.log(event.data.dataRow.treatmentID)
    if(event.expand) {
      this.shared.getTreatmentDetail(event.data.dataRow.treatmentID).subscribe(
        (data: any) => {
          this.treatment = data.treatmentSessions
        }
      )
    }
  }

}
