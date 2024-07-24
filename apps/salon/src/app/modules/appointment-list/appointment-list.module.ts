import { TDSButtonModule } from 'tds-ui/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentListComponent } from './appointment-list.component';
import { RouterModule, Routes } from '@angular/router';
import { TDSDatePickerModule } from 'tds-ui/date-picker';
import { FormsModule } from '@angular/forms';
import { TDSTabsModule } from 'tds-ui/tabs';
import { TDSTableModule } from 'tds-ui/table';
import { TDSTagModule } from 'tds-ui/tag';
import { AppointmentTableListComponent } from './appointment-table-list/appointment-table-list.component';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSAutocompleteModule } from 'tds-ui/auto-complete';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSSelectModule } from 'tds-ui/select';
import { TDSDropDownModule } from 'tds-ui/dropdown';
import { AppointmentModalComponent } from '../home/appointment-modal/appointment-modal.component';

const routes: Routes = [{ path: '', component: AppointmentListComponent }];
@NgModule({
  declarations: [AppointmentListComponent,AppointmentTableListComponent],
  imports: [
    CommonModule,
    TDSDatePickerModule,
    FormsModule,
    TDSTabsModule,
    RouterModule.forChild(routes),
    TDSTableModule,
    TDSTagModule,
    TDSFormFieldModule,
    TDSAutocompleteModule,
    TDSInputModule,
    TDSSelectModule,
    TDSButtonModule,
    TDSDropDownModule,
    AppointmentModalComponent
  ],
  exports: [AppointmentListComponent],
})
export class AppointmentListModule {}
