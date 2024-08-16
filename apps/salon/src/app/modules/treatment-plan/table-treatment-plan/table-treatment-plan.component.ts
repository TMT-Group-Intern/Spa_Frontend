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

  //
  onClickService(idService: any, event: any) {
    // const row = event.treatmendSessionDetail
    // const val = row.map((v:any) => v.serviceID)
    this.company._change_service$.next(idService);
    this.company._change_session_status$.next(event.sessionID);
  }

  //
  onClickRow(event: any) {
    const row = event.treatmendSessionDetail
    const val = row.map((v: any) => v.serviceID)
    this.company._change_service$.next(val);
    this.company._change_session_status$.next(event.sessionID);
  }

  //
  treatmentDetail(id: number) {
    this.shared.getTreatmentDetail(id).subscribe(
      (data: any) => {
        this.treatment = data.treatmentSessions
      }
    )
  }
}
