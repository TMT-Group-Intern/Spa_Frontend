import { Component, OnInit } from '@angular/core';
import { TDSBarChartComponent, TDSChartOptions } from 'tds-report';

@Component({
  selector: 'frontend-revenue-statistics',
  templateUrl: './revenue-statistics.component.html',
  styleUrls: ['./revenue-statistics.component.scss'],
})
export class RevenueStatisticsComponent implements OnInit{
  options: any;

  size: any = [1350, 350];
  //căn chỉnh width,height của chart layout. giá trị có thể là number hoặc 'auto'

  chartOptions = TDSChartOptions();
  //gọi hàm khởi tạo TDSCustomChartOption

  chartComponent: TDSBarChartComponent = {

      axis: {

        xAxis:[
          {
            data: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31 ]
          }
        ]
      },
      series: [
        {
          type: 'bar',
          name: 'Data 1',
          data: [ 220, 182, 111, 122, 345, 164, 101, 222, 234, 115, 90, 300 ]
        },
      ]
  }
  // khởi tạo 1 object TDSBarChartComponent với 2 thành phần cơ bản axis, series

  expandSet = new Set<number>();

        listOfData = [
            {
                id: 1,
                name: 'John Brown',
                age: 32,
                expand: false,
                address: 'New York No. 1 Lake Park',
                description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
            },
            {
                id: 2,
                name: 'Jim Green',
                age: 42,
                expand: false,
                address: 'London No. 1 Lake Park',
                description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.'
            },
            {
                id: 3,
                name: 'Joe Black',
                age: 32,
                expand: false,
                address: 'Sidney No. 1 Lake Park',
                description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.'
            }
        ];

        onExpandChange(id: number, checked: boolean): void {
          if (checked) {
              this.expandSet.add(id);
          } else {
              this.expandSet.delete(id);
          }
      }

  ngOnInit(): void {
    this.options = (this.chartOptions as any).BarChartOption(this.chartComponent); //khởi tạo option bar chart cơ bản
  }
}
