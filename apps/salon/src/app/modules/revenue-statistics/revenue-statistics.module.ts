import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevenueStatisticsComponent } from './revenue-statistics.component';
import { TDSEchartsModule } from 'tds-report';



@NgModule({
  declarations: [RevenueStatisticsComponent],
  imports: [
    CommonModule,
    TDSEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
  ],
})
export class RevenueStaticsModule { }
