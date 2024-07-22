import { Component, inject, OnInit } from '@angular/core';
import { TDSBarChartComponent, TDSChartOptions } from 'tds-report';
import { AuthService } from '../../shared.service';
import { endOfMonth, format, startOfMonth } from 'date-fns';
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

  private readonly sharedServices = inject(AuthService)
  private readonly company = inject(CompanyService)

  options: any;
  listOfData: any;
  listOfDataDetail: any;
  public userSession: any;
  valueArray: any;
  storedUserSession = localStorage.getItem('userSession');
  rangeDate =null;
  size: any = [1350, 350];

  // Tạo mảng mới chứa 31 phần tử, ban đầu chứa toàn số 0
   newArray = Array(31).fill(0);

  // Duyệt qua các object trong mảng gốc


  chartOptions = TDSChartOptions();
  //gọi hàm khởi tạo TDSCustomChartOption

  leftControl = {
    Today: [new Date(), new Date()],
    'Tháng này': [startOfMonth( new Date()), endOfMonth(new Date())]
};

  chartComponent: TDSBarChartComponent = {
    axis: {
      xAxis: [
        {
          data: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31
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
  };
  // khởi tạo 1 object TDSBarChartComponent với 2 thành phần cơ bản axis, series

  expandSet = new Set<number>();
  thisMonth = this.leftControl['Tháng này']
  startOfMonthDate = format(this.thisMonth[0],DATE_CONFIG.DATE_BASE);
  endOfMonthDate = format(this.thisMonth[1],DATE_CONFIG.DATE_BASE);

  // Lấy dữ liệu báo cáo doanh thu theo ngày.
  getReportDataByDate(){

    const branchID = this.userSession.user.branchID

    this.sharedServices.getByDays(branchID,this.startOfMonthDate as unknown as string,this.endOfMonthDate as unknown as string).subscribe(
      (data: any) =>{

        this.listOfData = data

        console.log(this.listOfData);
        this.valueArray = [...data.map((item: any)=>({
            day: new Date(item.Date).getDate(),
            value: item.Value
        }))];

        console.log(this.valueArray);
        this.valueArray.forEach((item:any) => {
          if (item.day >= 1 && item.day <= 31) {
            this.newArray[item.day - 1] = item.value;
          }
        });

        this.options = (this.chartOptions as any).BarChartOption(
          this.chartComponent
        ); //khởi tạo option bar chart cơ bản
      }
    )
  }

  onExpandChange(id: number,date: Date, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
      this.onChangeShowDetail(date)
    } else {
      this.expandSet.delete(id);
    }
  }
  // Hiển thị chi tiết danh sách giao dịch thanh toán của 1 ngày
  onChangeShowDetail(date: Date): void {
    const fromDay = format(date, DATE_CONFIG.DATE_BASE_FROM);
    const fromTo = format(date, DATE_CONFIG.DATE_BASE_TO);
    const branchID = this.userSession.user.branchID
    this.sharedServices.getDetails(branchID,fromDay as unknown as string,fromTo as unknown as string).subscribe(
      (data: any) => {
        this.listOfDataDetail = data
      }
    )
}
  ngOnInit(): void {

    if (this.storedUserSession !== null) {
      this.userSession = JSON.parse(this.storedUserSession);
      this.getReportDataByDate();
    }


    this.company._companyIdCur$
    .pipe(
      filter((companyId) => !!companyId),
      concatMap((branchID) => {
        return this.sharedServices.getByDays(branchID as number ,this.startOfMonthDate as unknown as string,this.endOfMonthDate as unknown as string);
      })
    )
    .subscribe((data: any) => {
      this.listOfData = data;
    });
  }
}
