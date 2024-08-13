import { Component, inject, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { TDSModalService } from 'tds-ui/modal';
import { ModalTreatmentPlanComponent } from './modal-treatment-plan/modal-treatment-plan.component';
import { AuthService } from '../../shared.service';

@Component({
  selector: 'frontend-treatment-plan',
  templateUrl: './treatment-plan.component.html',
  styleUrls: ['./treatment-plan.component.scss'],
})
export class TreatmentPlanComponent implements OnChanges {
  @Input() customerId?: number;
  private readonly modalSvc = inject(TDSModalService)
  listOfData: any[] = []
  treatment: any[] = []
  expandSet = new Set<number>();

  constructor (
    private shared: AuthService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['customerId']?.currentValue){
       this.getTreatmentByCustomerId(this.customerId as number);
    }
  }

  //
  getTreatmentByCustomerId(customerId: number):void{
    if(customerId) {
      this.shared.getTreatmentOfCustomer(customerId).subscribe(
        (data) => {
          this.listOfData = data
        }
      )
    }
  }

  // Sử dụng modal
  modalCreateTreatmentPlan():void{
    const modal = this.modalSvc.create({
      title:'Tạo lộ trình điều trị',
      content:ModalTreatmentPlanComponent,
      footer: null,
      size:'lg',
      componentParams:{
        customerId: this.customerId
      }
    })
    modal.afterClose.asObservable().subscribe((res)=>{
      if(res){
        this.getTreatmentByCustomerId(this.customerId as number)
      }
    })
  }
  modalEditTreatmentPlan(id:number):void{
    const modal = this.modalSvc.create({
      title:'Sửa lộ trình điều trị',
      content:ModalTreatmentPlanComponent,
      footer: null,
      size:'xl',
      componentParams:{
        customerId: this.customerId,
        treatmentId:id
      }
    })
    modal.afterClose.asObservable().subscribe((res)=>{
      if(res){
        this.getTreatmentByCustomerId(this.customerId as number)
      }
    })
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

}
