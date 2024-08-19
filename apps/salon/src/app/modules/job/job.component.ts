import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TDSColumnSettingsModule } from 'tds-ui/column-settings';
import { TDSDataTableModule } from 'tds-ui/data-table';
import { TDSListModule } from 'tds-ui/list';
import { UsersModalComponent } from '../users/users-modal/users-modal.component';
import { TDSTimelineModule } from 'tds-ui/timeline';
import { TDSToolTipModule } from 'tds-ui/tooltip';
import { TDSButtonModule } from 'tds-ui/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSSelectModule } from 'tds-ui/select';
import { TDSCascaderModule } from 'tds-ui/cascader';
import { TDSPaginationModule } from 'tds-ui/pagination';

@Component({
  selector: 'frontend-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TDSListModule,
    TDSDataTableModule,
    TDSColumnSettingsModule,
    UsersModalComponent,
    TDSTimelineModule,
    TDSToolTipModule,
    TDSButtonModule,
    ReactiveFormsModule,
    TDSFormFieldModule,
    TDSSelectModule,
    FormsModule,
    TDSCascaderModule,
    TDSPaginationModule,
  ],
})
export class JobComponent {}
