import { BehaviorSubject, filter, tap } from 'rxjs';
import { Component, inject, OnInit } from '@angular/core';
import { addDays, endOfMonth, format, startOfMonth } from 'date-fns';
import { DATE_CONFIG } from '../../core/enums/date-format.enum';
import { AuthService } from '../../shared.service';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { CompanyService } from '../../core/services/company.service';
export type TTypeState =
  | 'Đã hẹn'
  | 'Chờ khám'
  | 'Không sử dụng dịch vụ'
  | 'Đã khám'
  | 'Chờ chăm sóc'
  | 'Hoàn thành';
@Component({
  selector: 'frontend-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss'],
})
export class AppointmentListComponent implements OnInit {
  private readonly shareApi = inject(AuthService);
  private readonly company = inject(CompanyService);
  constructor() {
    (this.selectedIndex = 0),
      this.startDate,
      this.endDate,
      this.branchId,
      (this.search = '');
  }
  readonly tabs:TTypeState[] = [
    'Đã hẹn',
    'Chờ khám',
    'Không sử dụng dịch vụ',
    'Đã khám',
    'Chờ chăm sóc',
    'Hoàn thành',
  ];
  selectedIndex = 0;
  search?: string = ' ';
  today = new Date();
  lastMonth = new Date(this.today.getFullYear(), this.today.getMonth() - 1, 1);
  rangeDate = {
    'Hôm nay': [this.today, this.today],
    'Hôm qua': [addDays(this.today, -1), this.today],
    '7 ngày qua': [addDays(this.today, -7), this.today],
    '30 ngày qua': [addDays(this.today, -30), this.today],
    'Tháng này': [startOfMonth(new Date()), endOfMonth(new Date())],
    'Tháng trước': [startOfMonth(this.lastMonth), endOfMonth(this.lastMonth)],
  };
  listOfData: any | undefined;
  branchId: any;
  userSession: any;
  storedUserSession = localStorage.getItem('userSession');
  inputValue?: string;
  options: TDSSafeAny;

  thisTime = this.rangeDate['Hôm nay'];
  startDate = format(this.thisTime[0], DATE_CONFIG.DATE_BASE_FROM);
  endDate = format(this.thisTime[1], DATE_CONFIG.DATE_BASE_TO);

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.search = value;
    this.listOfData.filter((item: any) =>
      item.customer.phone.includes(value.toLowerCase())
    );
    this.company._search$.next(value);
  }
  onChange(result: any): void {
    const fromDate = format(result[0], DATE_CONFIG.DATE_BASE);
    const toDate = format(result[1], DATE_CONFIG.DATE_BASE);
    this.startDate = fromDate;
    this.endDate = toDate;
  }
  ngOnInit() {
    if (this.storedUserSession !== null) {
      this.userSession = JSON.parse(this.storedUserSession);
      this.branchId = this.userSession.user.branchID;
    }
    this.company._companyIdCur$
      .pipe(
        filter((companyId) => !!companyId),
        tap((company) => company)
      )
      .subscribe((data) => (this.branchId = data));
  }
}
