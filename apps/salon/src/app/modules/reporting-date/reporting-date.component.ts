import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TDSDatePickerModule } from 'tds-ui/date-picker';
import { TDSTableModule } from 'tds-ui/table';
import { TDSTabsModule } from 'tds-ui/tabs';
import { TableReportingDateComponent } from './table-reporting-date/table-reporting-date.component';
import { differenceInCalendarDays } from 'date-fns';

@Component({
  selector: 'frontend-reporting-date',
  templateUrl: './reporting-date.component.html',
  styleUrls: ['./reporting-date.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TableReportingDateComponent,
    ReactiveFormsModule,
    TDSTableModule,
    TDSDatePickerModule,
    TDSTabsModule,
    FormsModule
  ],
})
export class ReportingDateComponent implements OnInit {
  valueArray: any;
  storedUserSession = localStorage.getItem('userSession');
  userSession: any;
  branchId: any;
  date: Date = new Date();
  toDay = new Date();
  rangeDate = {

  }
  constructor() {
    this.branchId,
      this.date
  }
  ngOnInit(): void {
    if (this.storedUserSession !== null) {
      this.userSession = JSON.parse(this.storedUserSession);
      this.branchId = this.userSession.user.branchID;
    }
  }
  onChange(date: any) {
    this.date = date;
  }
  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date()) > 0;
}
