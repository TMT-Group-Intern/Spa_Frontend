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
const routes = [{ path: 'test', component: TreatmentPlanComponent }];
@NgModule({
  declarations: [TreatmentPlanComponent, ModalTreatmentPlanComponent],
  imports: [
    CommonModule,
    TDSButtonModule,
    TDSToolTipModule,
    RouterModule.forChild(routes),
    TDSFormFieldModule,
    TDSInputModule,
    ReactiveFormsModule,
    TDSSelectModule,
    FormsModule
  ],
  exports: [TreatmentPlanComponent],
})
export class TreatmentPlanModule {}
