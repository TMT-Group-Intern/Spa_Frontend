import {
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { addDays, endOfMonth, format, startOfMonth } from 'date-fns';
import { DATE_CONFIG } from '../../core/enums/date-format.enum';
import { AuthService } from '../../shared.service';

@Component({
  selector: 'frontend-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss'],
})
export class AppointmentListComponent implements OnInit {
  private readonly shareApi = inject(AuthService);
  constructor(){
    this.selectedIndex,
    this.startDate,
    this.endDate,
    this.branchId
  }
  tabs = [
    'Hẹn',
    'Chờ khám',
    'Không sử dụng dịch vụ',
    'Đã khám',
    'Chờ làm',
    'Đã hoàn thành',
  ];
  selectedIndex?: number = 0;

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

  thisTime = this.rangeDate['Hôm nay'];
  startDate = format(this.thisTime[0], DATE_CONFIG.DATE_BASE_FROM);
  endDate = format(this.thisTime[1], DATE_CONFIG.DATE_BASE_TO);
  onChange(result: any): void {
    const fromDate = format(result[0], DATE_CONFIG.DATE_BASE);
    const toDate = format(result[1], DATE_CONFIG.DATE_BASE);
    this.startDate = fromDate;
    this.endDate = toDate;
    this.initAppointmentbyDays(fromDate, toDate);
  }
  ngOnInit() {
    if (this.storedUserSession !== null) {
      this.userSession = JSON.parse(this.storedUserSession);
      this.branchId = this.userSession.user.branchID;
      this.initAppointmentbyDays(this.startDate, this.endDate);
    }
  }
  initAppointmentbyDays(fromDate: string, toDate: string): void {
    this.shareApi
      .getAppointmentByDays(this.branchId, fromDate, toDate)
      .subscribe((data) => {
        this.listOfData = data.filter(
          (item: any) => item.status === this.tabs[this.selectedIndex as number]
        );
      });
  }
}
