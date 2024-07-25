import { BehaviorSubject, filter, tap } from 'rxjs';
import { Component, inject, OnInit } from '@angular/core';
import { addDays, endOfMonth, format, startOfMonth } from 'date-fns';
import { DATE_CONFIG } from '../../core/enums/date-format.enum';
import { AuthService } from '../../shared.service';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { CompanyService } from '../../core/services/company.service';
import { TDSModalService } from 'tds-ui/modal';
import { AppointmentModalComponent } from '../home/appointment-modal/appointment-modal.component';
export type TTypeState =
|'Tất cả'
|'Đã hẹn'
|'Hủy hẹn'
|'Chờ khám'
|'Đang khám'
|'Đã khám'
|'Không sử dụng dịch vụ'
|'Chờ chăm sóc'
|'Đang chăm sóc'
|'Hoàn thành'
|'Chưa thanh toán'
|'Thanh toán 1 phần'
|'Hoàn tất thanh toán'
@Component({
  selector: 'frontend-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss'],
})
export class AppointmentListComponent implements OnInit {
  private readonly shareApi = inject(AuthService);
  private readonly company = inject(CompanyService);
  private readonly modalSvc = inject(TDSModalService)
  constructor() {
    (this.selectedIndex = 0),
      this.startDate,
      this.endDate,
      this.branchId,
      (this.search = '');
  }
  readonly tabs:TTypeState[] = [
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
    'Chưa thanh toán',
    'Thanh toán 1 phần',
    'Hoàn tất thanh toán',
  ];
  selectedIndex = 0;
  search= '';
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
  callModalCreateAppointment(){
    const modal= this.modalSvc.create({
      title:'Tạo lịch hẹn',
      content: AppointmentModalComponent,
      footer: null,
      size:'lg'
    })
    modal.afterClose.asObservable().subscribe(()=>{
      this.search ='';
    })
  }
}
