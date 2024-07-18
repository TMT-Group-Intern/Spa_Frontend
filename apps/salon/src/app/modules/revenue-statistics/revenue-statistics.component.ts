import { Component, inject, OnInit } from '@angular/core';
import { TDSBarChartComponent, TDSChartOptions } from 'tds-report';
import { AuthService } from '../../shared.service';
import { addDays, endOfMonth, format, startOfMonth } from 'date-fns';
import { DATE_CONFIG } from '../../core/enums/date-format.enum';
import { concatMap, filter } from 'rxjs';
import { CompanyService } from '../../core/services/company.service';
import { log } from 'console';

@Component({
  selector: 'frontend-revenue-statistics',
  templateUrl: './revenue-statistics.component.html',
  styleUrls: ['./revenue-statistics.component.scss'],
})
export class RevenueStatisticsComponent implements OnInit {
  private readonly sharedServices = inject(AuthService);
  private readonly company = inject(CompanyService);

  options: any;
  listOfData: any;
  listOfDataDetail: any;
  public userSession: any;
  valueArray: any;
  storedUserSession = localStorage.getItem('userSession');
  rangeDate: any = [];
  size: any = [1350, 350];
  // lstData: Array<{ start: Date; end: Date; data: TDSSafeAny }> = [];

  // Tạo mảng mới chứa 31 phần tử, ban đầu chứa toàn số 0
  newArray = Array(31).fill(0);

  chartOptions = TDSChartOptions();
  //gọi hàm khởi tạo TDSCustomChartOption
  today = new Date();
  lastMonth = new Date(this.today.getFullYear(), this.today.getMonth() - 1, 1);
  leftControl = {
    'Hôm nay': [this.today, this.today],
    'Hôm qua': [addDays(this.today, -1), this.today],
    '7 ngày qua': [addDays(this.today, -7), this.today],
    '30 ngày qua': [addDays(this.today, -30), this.today],
    'Tháng này': [startOfMonth(new Date()), endOfMonth(new Date())],
    'Tháng trước': [startOfMonth(this.lastMonth), endOfMonth(this.lastMonth)],
  };

  dataFirst = {
    axis: {
      xAxis: [
        {
          data: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
          ],
        },
      ],
    },
    series: [
      {
        type: 'bar',
        name: 'Data 1',
        data: this.newArray,
      },
    ],
  } as TDSBarChartComponent;

  chartComponent: TDSBarChartComponent = { ...this.dataFirst };
  // khởi tạo 1 object TDSBarChartComponent với 2 thành phần cơ bản axis, series

  expandSet = new Set<number>();
  thisMonth = this.leftControl['Tháng này'];
  startOfMonthDate = format(this.thisMonth[0], DATE_CONFIG.DATE_BASE_FROM);
  endOfMonthDate = format(this.thisMonth[1], DATE_CONFIG.DATE_BASE_TO);

  // tạo mảng từ 1 start đến 1 end
  arrayFromRange(start: number, end: number): number[] {
    const array: number[] = [];
    for (let i = start; i <= end; i++) {
      array.push(i);
    }
    return (this.rangeDate = array);
  }

  getDateArray7Days(startDay: number, endDay: number) {
    const now = new Date();
    const startMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      startDay
    );
    const endMonth = new Date(now.getFullYear(), now.getMonth(), endDay);

    const dateArray: Date[] = [];
    const currentDate = startMonth;

    while (currentDate <= endMonth) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    const numberdays = dateArray.map((item: any) => new Date(item).getDate());
    return this.rangeDate = numberdays;
  }
  // chọn thời gian
  onSelectionChange(selection: any) {
    this.startOfMonthDate = format(selection[0], DATE_CONFIG.DATE_BASE_FROM);
    this.endOfMonthDate = format(selection[1], DATE_CONFIG.DATE_BASE_TO);
    const start = new Date(this.startOfMonthDate).getMonth();
    const end = new Date(this.endOfMonthDate).getMonth();
    const fromDay = new Date(selection[0]).getDate();
    const fromToDay = new Date(selection[1]).getDate();

    if (start !== end) {
      this.getDateArray7Days(fromDay, fromToDay);
    } else {
      this.arrayFromRange(fromDay, fromToDay);
    }
    this.getReportDataByDate();
  }
  // Lấy dữ liệu báo cáo doanh thu theo ngày.
  getReportDataByDate() {
    const branchID = this.userSession.user.branchID;

    this.sharedServices
      .getByDays(
        branchID,
        this.startOfMonthDate as unknown as string,
        this.endOfMonthDate as unknown as string
      )
      .subscribe((data: any) => {
        //  this.listOfData = data;
        this.listOfData = data.map((item: any, index = 1) => ({
          id: ++index,
          Date: item.Date,
          TotalRevenue: item.TotalRevenue,
          Value: item.Value,
        }));

        console.log(this.listOfData);
        this.valueArray = [
          ...data.map((item: any) => ({
            day: new Date(item.Date).getDate(),
            value: item.Value,
          })),
        ];

        this.newArray = this.rangeDate.map((val: any) => {
          const matchedItem = this.valueArray.find(
            (item: any) => item.day === val
          );
          return matchedItem ? matchedItem.value : 0;
        });
        console.log(this.newArray);

        this.chartComponent = {
          ...this.dataFirst,
          axis: {
            xAxis: [
              {
                data: this.rangeDate,
              },
            ],
          },
          series: [
            {
              type: 'bar',
              name: 'Data 1',
              data: this.newArray,
            },
          ],
        };

        this.options = (this.chartOptions as any).BarChartOption(
          this.chartComponent
        ); //khởi tạo option bar chart cơ bản
      });
  }

  onExpandChange(id: number, date: Date, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
      this.onChangeShowDetail(date);
    } else {
      this.expandSet.delete(id);
    }
  }
  // Hiển thị chi tiết danh sách giao dịch thanh toán của 1 ngày
  onChangeShowDetail(date: Date): void {
    const fromDay = format(date, DATE_CONFIG.DATE_BASE_FROM);
    const fromTo = format(date, DATE_CONFIG.DATE_BASE_TO);
    const branchID = this.userSession.user.branchID;
    this.sharedServices
      .getDetails(
        branchID,
        fromDay as unknown as string,
        fromTo as unknown as string
      )
      .subscribe((data: any) => {
        this.listOfDataDetail = data;
      });
  }
  ngOnInit(): void {
    if (this.storedUserSession !== null) {
      this.userSession = JSON.parse(this.storedUserSession);
      this.getReportDataByDate();
    }
    this.onSelectionChange(this.thisMonth)
    // chạy khi chi nhánh thay đổi
    this.company._companyIdCur$
      .pipe(
        filter((companyId) => !!companyId),
        concatMap((branchID) => {
          return this.sharedServices.getByDays(
            branchID as number,
            this.startOfMonthDate as unknown as string,
            this.endOfMonthDate as unknown as string
          );
        })
      )
      .subscribe((data: any) => {
        this.listOfData = data;
      });
  }
}
