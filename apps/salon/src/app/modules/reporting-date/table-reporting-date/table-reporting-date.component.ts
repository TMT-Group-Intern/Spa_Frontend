import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TDSTableModule } from 'tds-ui/table';
import { AuthService } from '../../../shared.service';
import { format } from 'date-fns';
import { DATE_CONFIG } from '../../../core/enums/date-format.enum';

@Component({
  selector: 'frontend-table-reporting-date',
  templateUrl: './table-reporting-date.component.html',
  styleUrls: ['./table-reporting-date.component.scss'],
  standalone: true,
  imports:[
    CommonModule,
    TDSTableModule
  ],
})
export class TableReportingDateComponent implements OnInit, OnChanges {
  private readonly sharedApi = inject(AuthService)
  @Input() branchId?: number;
  @Input() date?: Date;
  listOfDataDetail: any
  totalMoney?: number;
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['branchId']?.currentValue || changes['date']?.currentValue){
      this.listBillOfDay(this.date as Date)
      this.getReportDataByDate(this.date as Date)
    }
  }
  ngOnInit(): void {
    this.listBillOfDay(this.date as Date)
    this.getReportDataByDate(this.date as Date)
  }
  listBillOfDay(date: Date): void {
    const fromDay = format(date, DATE_CONFIG.DATE_BASE_FROM);
    const fromTo = format(date, DATE_CONFIG.DATE_BASE_TO);
    this.sharedApi
      .getDetails(
        this.branchId as number,
        fromDay as unknown as string,
        fromTo as unknown as string
      )
      .subscribe((data: any) => {
        this.listOfDataDetail = data;
      });
  }

  getReportDataByDate(date: Date) {
    const fromDay = format(date, DATE_CONFIG.DATE_BASE_FROM);
    const fromTo = format(date, DATE_CONFIG.DATE_BASE_TO);
    this.sharedApi
      .getByDays(
        this.branchId as number,
        fromDay as unknown as string,
        fromTo as unknown as string
      )
      .subscribe((data: any) => {
        const temp = data.map((item: any) => (
          item.totalRevenue
        ))
        this.totalMoney =  temp.length >0? temp: 0;
      });
      }
}
