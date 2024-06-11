import { Component, OnInit } from '@angular/core';
import { TDSBarChartComponent, TDSChartOptions } from 'tds-report';

@Component({
  selector: 'frontend-revenue-statistics',
  templateUrl: './revenue-statistics.component.html',
  styleUrls: ['./revenue-statistics.component.scss'],
})
export class RevenueStatisticsComponent implements OnInit{
  options: any;

  size: any = [800, 450];
  //căn chỉnh width,height của chart layout. giá trị có thể là number hoặc 'auto'

  chartOptions = TDSChartOptions();
  //gọi hàm khởi tạo TDSCustomChartOption

  chartComponent: TDSBarChartComponent = {
      axis: {
        xAxis:[
          {
            data: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ]
          }
        ]
      },
      series: [
        {
          type: 'bar',
          name: 'Data 1',
          data: [ 220, 182, 111, 122, 345, 164, 101, 222, 234, 115, 90, 300 ]
        },
        {
          type: 'bar',
          name: 'Data 2',
          data: [ 118, 92, 91, 102, 300, 109, 80, 145, 144, 95, 76, 220 ]
        }
      ]
  }
  // khởi tạo 1 object TDSBarChartComponent với 2 thành phần cơ bản axis, series

  ngOnInit(): void {
    this.options = (this.chartOptions as any).BarChartOption(this.chartComponent); //khởi tạo option bar chart cơ bản
  }
}
