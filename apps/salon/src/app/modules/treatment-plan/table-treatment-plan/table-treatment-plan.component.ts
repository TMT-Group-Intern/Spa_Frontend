import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AuthService } from '../../../shared.service';

@Component({
  selector: 'frontend-table-treatment-plan',
  templateUrl: './table-treatment-plan.component.html',
  styleUrls: ['./table-treatment-plan.component.scss'],
})
export class TableTreatmentPlanComponent implements OnChanges {
  private readonly shared = inject(AuthService);
  @Input() id?:number;
  treatment: any;
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['id']?.currentValue){
      this.treatmentDetail(this.id as number);
    }
  }

  treatmentDetail(id: number) {
      this.shared.getTreatmentDetail(id).subscribe(
        (data: any) => {
          this.treatment = data.treatmentSessions
          console.log(this.treatment)
        }
      )
  }
}
