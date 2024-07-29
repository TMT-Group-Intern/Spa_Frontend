import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevenueStatisticsComponent } from './revenue-statistics.component';
import { TDSEchartsModule } from 'tds-report';
import { RouterModule, Routes } from '@angular/router';
import { TDSTableModule } from 'tds-ui/table';
import { TDSDatePickerModule } from 'tds-ui/date-picker';
import { TDSInputModule } from 'tds-ui/tds-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RevenueStatisticsDetailComponent } from './revenue-statistics-detail/revenue-statistics-detail.component';

const routes: Routes = [
  { path: 'revenue-statistics',
    component:RevenueStatisticsComponent
    }

];

@NgModule({
  declarations: [
    RevenueStatisticsComponent,
    RevenueStatisticsDetailComponent,
  ],
  imports: [
    CommonModule,
    TDSTableModule,
    TDSDatePickerModule,
    TDSInputModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
    TDSEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ],
  exports: [RevenueStatisticsComponent],
})
export class RevenueStaticsModule {}
