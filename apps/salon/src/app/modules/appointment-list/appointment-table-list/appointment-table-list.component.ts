import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from '../../../shared.service';
import { DATE_CONFIG } from '../../../core/enums/date-format.enum';
import { format } from 'date-fns';

@Component({
  selector: 'frontend-appointment-table-list',
  templateUrl: './appointment-table-list.component.html',
  styleUrls: ['./appointment-table-list.component.scss'],
})
export class AppointmentTableListComponent implements OnChanges{
  private readonly shareApi = inject(AuthService)
  @Input() branchId?: number;
  @Input() selectedIndex?: number;
  @Input() startDay: string | undefined;
  @Input() endDay: string | undefined;
  listOfData: any;
  tabs = [
    'Hẹn',
    'Chờ khám',
    'Không sử dụng dịch vụ',
    'Đã khám',
    'Chờ làm',
    'Đã hoàn thành',
  ];
  ngOnChanges(): void {
    this.initAppointmentbyDays(this.startDay as string,this.endDay as string)
  }

  initAppointmentbyDays(fromDate: string, toDate: string): void {
    this.shareApi
      .getAppointmentByDays(this.branchId as number, fromDate, toDate)
      .subscribe((data) => {
        this.listOfData = data.filter(
          (item: any) => item.status === this.tabs[this.selectedIndex as number]
        );
      });
  }
}
