import { Component, inject } from '@angular/core';
import { TDSModalService } from 'tds-ui/modal';
import { ModalTreatmentPlanComponent } from './modal-treatment-plan/modal-treatment-plan.component';

@Component({
  selector: 'frontend-treatment-plan',
  templateUrl: './treatment-plan.component.html',
  styleUrls: ['./treatment-plan.component.scss'],
})
export class TreatmentPlanComponent {
  private readonly modalSvc = inject(TDSModalService)
  // Sử dụng modal
  modalTreatmentPlan():void{
    const modal = this.modalSvc.create({
      title:'Tạo lộ trình điều trị',
      content:ModalTreatmentPlanComponent,
      okText:'Xác nhận',
      footer: null,
      size:'lg'
    })
  }
}
