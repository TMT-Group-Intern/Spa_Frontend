import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevenueStatisticsComponent } from './revenue-statistics.component';
import { TDSEchartsModule } from 'tds-report';
import { RouterModule, Routes } from '@angular/router';

const routes : Routes = [
      {path: '', component: RevenueStatisticsComponent},
]

@NgModule({
  declarations: [RevenueStatisticsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TDSEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
  ],
  exports:[RevenueStatisticsComponent]
})
export class RevenueStaticsModule { }
