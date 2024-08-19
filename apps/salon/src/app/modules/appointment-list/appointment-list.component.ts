import { BehaviorSubject, filter, tap } from 'rxjs';
import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { addDays, endOfMonth, format, startOfMonth } from 'date-fns';
import { DATE_CONFIG } from '../../core/enums/date-format.enum';
import { AuthService } from '../../shared.service';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { CompanyService } from '../../core/services/company.service';
import { TDSModalService } from 'tds-ui/modal';
import { AppointmentModalComponent } from '../home/appointment-modal/appointment-modal.component';
export type TTypeState =
  | 'Tất cả'
  | 'Đã hẹn'
  | 'Hủy hẹn'
  | 'Chờ khám'
  | 'Đang khám'
  | 'Đã khám'
  | 'Không sử dụng dịch vụ'
  | 'Chờ chăm sóc'
  | 'Đang chăm sóc'
  | 'Hoàn thành'
  | 'Chưa thanh toán'
  | 'Thanh toán 1 phần'
  | 'Thanh toán hoàn tất';
@Component({
  selector: 'frontend-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss'],
})
export class AppointmentListComponent implements OnInit, OnChanges {
  private readonly shareApi = inject(AuthService);
  private readonly company = inject(CompanyService);
  private readonly modalSvc = inject(TDSModalService);
  constructor() {
    (this.selectedIndex = 0),
      this.startDate,
      this.endDate,
      this.branchId,
      this.boolean$,
      this.listOfData,
      (this.search = '');
  }

  readonly tabs: TTypeState[] = [
    'Tất cả',
    'Đã hẹn',
    'Hủy hẹn',
    'Chờ khám',
    'Đang khám',
    'Đã khám',
    'Không sử dụng dịch vụ',
    'Chờ chăm sóc',
    'Đang chăm sóc',
    'Hoàn thành',
    //'Chưa thanh toán',
    // 'Thanh toán 1 phần',
    // 'Thanh toán hoàn tất',
  ];
  selectedIndex = 0;
  search = '';
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
  boolean$?: boolean = true;
  userSession: any;
  storedUserSession = localStorage.getItem('userSession');
  inputValue?: string;
  options: TDSSafeAny;

  thisTime = this.rangeDate['Hôm nay'];
  @Input() _startDate = format(this.thisTime[0], DATE_CONFIG.DATE_BASE_FROM);
  @Input() _endDate = format(this.thisTime[1], DATE_CONFIG.DATE_BASE_TO);
  startDate = format(this.thisTime[0], DATE_CONFIG.DATE_BASE_FROM);
  endDate = format(this.thisTime[1], DATE_CONFIG.DATE_BASE_TO);


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

    this.company._check_create$.pipe(
    ).subscribe(data => {
      this.boolean$ = data
    })
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['_startDate']?.currentValue || changes['_endDate'].currentValue) {
      this.startDate = this._startDate;
      this.endDate = this._endDate;
      this.thisTime = [this.startDate as unknown as Date, this.endDate as unknown as Date]
    }
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.search = value;
  }

  onChange(result: any): void {
    this.startDate = format(result[0], DATE_CONFIG.DATE_BASE_FROM);
    this.endDate = format(result[1], DATE_CONFIG.DATE_BASE_TO);
  }
  callModalCreateAppointment() {
    const modal = this.modalSvc.create({
      title: 'Tạo lịch hẹn',
      content: AppointmentModalComponent,
      footer: null,
      size: 'xl',
    });
    modal.afterClose.asObservable().subscribe((data) => {
      if (data) {
        if (this.boolean$ === false) {
          this.boolean$ = true;
        } else {
          this.boolean$ = false;
        }
      }
    });
  }
}
