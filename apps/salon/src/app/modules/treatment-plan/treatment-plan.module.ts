import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreatmentPlanComponent } from './treatment-plan.component';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSToolTipModule } from 'tds-ui/tooltip';
import { ModalTreatmentPlanComponent } from './modal-treatment-plan/modal-treatment-plan.component';
import * as path from 'path';
import { RouterModule } from '@angular/router';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSInputModule } from 'tds-ui/tds-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TDSSelectModule } from 'tds-ui/select';
import { TDSDataTableModule } from 'tds-ui/data-table';
import { TDSTimelineModule } from 'tds-ui/timeline';
import { TableTreatmentPlanComponent } from './table-treatment-plan/table-treatment-plan.component';
import { TDSTableModule } from 'tds-ui/table';
import { TDSTagModule } from 'tds-ui/tag';
import { TDSDropDownModule } from 'tds-ui/dropdown';
const routes = [{ path: 'test', component: TreatmentPlanComponent }];
@NgModule({
  declarations: [
    TreatmentPlanComponent,
    ModalTreatmentPlanComponent,
    TableTreatmentPlanComponent,
  ],
  imports: [
    CommonModule,
    TDSButtonModule,
    TDSToolTipModule,
    RouterModule.forChild(routes),
    TDSFormFieldModule,
    TDSInputModule,
    ReactiveFormsModule,
    TDSSelectModule,
    FormsModule,
    TDSDataTableModule,
    TDSTimelineModule,
    TDSToolTipModule,
    TDSTableModule,
    TDSTagModule,
    TDSDropDownModule
  ],
  exports: [TreatmentPlanComponent],
})
export class TreatmentPlanModule {}
