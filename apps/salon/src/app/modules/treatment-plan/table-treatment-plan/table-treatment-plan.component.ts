import { filter } from 'rxjs';
import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AuthService } from '../../../shared.service';
import { CompanyService } from '../../../core/services/company.service';

@Component({
  selector: 'frontend-table-treatment-plan',
  templateUrl: './table-treatment-plan.component.html',
  styleUrls: ['./table-treatment-plan.component.scss'],
})
export class TableTreatmentPlanComponent implements OnChanges {
  private readonly shared = inject(AuthService);
  private readonly company = inject(CompanyService)
  @Input() id?: number;
  treatment: any;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id']?.currentValue) {
      this.treatmentDetail(this.id as number);
    }
  }

  //Chọn dịch vụ cần thực hiện
  onClickService(idService: any, event: any){
    this.company._change_service$.next(idService);
    this.company._change_session_status$.next(event);
  }

  //chọn hàng của dịch vụ đó
  onClickRow(event: any){
    const valueFilter = event.filter((c: any)=> c.isDone == false);
    const val = valueFilter.map((v:any) => v.serviceID )
    this.company._change_service$.next(val);
    this.company._change_session_status$.next(event);
  }

  // lấy dữ liệu treatmentDetails
  treatmentDetail(id: number) {
      this.shared.getTreatmentDetail(id).subscribe(
        (data: any) => {
          this.treatment = data.treatmentDetails
        }
      )
  }
}
