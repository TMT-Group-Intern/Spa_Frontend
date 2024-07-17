import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevenueStatisticsComponent } from './revenue-statistics.component';
import { TDSEchartsModule } from 'tds-report';
import { RouterModule, Routes } from '@angular/router';
import { TDSTableModule } from 'tds-ui/table';
import { TDSDatePickerModule} from 'tds-ui/date-picker';
import { TDSInputModule } from 'tds-ui/tds-input';

const routes : Routes = [
      {path: '', component: RevenueStatisticsComponent},
]

@NgModule({
  declarations: [RevenueStatisticsComponent],
  imports: [
    CommonModule,
    TDSTableModule,
    TDSDatePickerModule,
    TDSInputModule,
    RouterModule.forChild(routes),
    TDSEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
  ],
  exports:[RevenueStatisticsComponent]
})
export class RevenueStaticsModule { }
