import { TDSTagModule } from 'tds-ui/tag';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSCalendarModule, WeekViewHourSegment } from 'tds-ui/calendar';
import { ReactiveFormsModule } from '@angular/forms';
import { TDSButtonModule } from 'tds-ui/button';
import { isSameDay, setHours, setMinutes } from 'date-fns';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSCalendarMode } from 'tds-ui/date-picker';
import { AuthService } from '../../shared.service';
import { filter } from 'rxjs';

@Component({
  selector: 'frontend-schedule',
  standalone: true,
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TDSCalendarModule,
    TDSTagModule,
    TDSButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.Default
})
export class SchedulesComponent implements OnInit {
  private readonly shareApi = inject(AuthService);
 private cdr = inject(ChangeDetectorRef)
  dayStartHour = 8;
  dayEndHour = 17;
  date = new Date();
  mode: TDSCalendarMode = 'date';
  lstData: Array<{ start: Date; end: Date; data: TDSSafeAny }> = [];
  dataAppointments: any;
  ngOnInit(): void {
    // this.lstData = this.randomDate();
    console.log(this.lstData);
    this.initAppointment()

  }

  // call get list of appoiment
  initAppointment() {
    this.shareApi.appointmentList(1).subscribe((data: any) => {
      this.dataAppointments = data.filter((item:any) => item.Doctor !== null)
      this.lstData = this.dataAppointments.map((item:any)=>({
        start: new Date(item.AppointmentDate),
        end: new Date(new Date(item.AppointmentDate).getTime() + 60 * 60000),
        data:{
          name:item.Customer.FirstName +' '+ item.Customer.LastName,
          doctor:item.Doctor,
          status: {
            name: item.Status,
            "status": "error",
            "bg": "bg-error-100"
        }
        }
      }))
      console.log(this.dataAppointments);
    });
  }

  randomDate() {
    // let today = new Date();
    // let lstData: Array<{ start: Date, end: Date, data: TDSSafeAny }> = [];
    // let min = 8;
    // let max = 17;
    // console.log(lstData);
    // return lstData.push({ start: today, end: today, data:{
    //   name:'dsdsa',
    //   doctor:'dsd'
    // }})
    const currentDate = new Date();
    return [
      {
          "start": new Date(),
          "end":new Date(currentDate.getTime() + 60 * 60000),
          "data": {
              "name": "Đào Xuân Hoàng",
              "doctor": "Huỳnh Diệp Sang",
              "status": {
                  "name": "Quá hẹn",
                  "status": "error",
                  "bg": "bg-error-100"
              }
          }
      } as any
  ]
  }

  panelChange(change: { date: Date; mode: string }): void {
    console.log(change.date, change.mode);
  }

  // randomDate() {
  //   const lstData: Array<{ start: Date; end: Date; data: TDSSafeAny }> = [];
  //   return lstData;
  // }

  getListName() {
    return [
      'Nguyễn Hải Hưng',
      'Nguyễn Thị Minh',
      'Nguyễn Tiến',
      'Nguyễn Trần Phước Bình',
      'Huỳnh Công Pha',
      'Đổng Kiến Lợi',
      'Bùi Đức Sang',
      'Nguyễn Thanh Duy',
      'Lê Toàn',
      'Đào Xuân Hoàng',
      'Nguyễn Tấn Đạt',
      'Trần Văn Phú',
      'Nguyễn Văn Hiếu',
      'Nguyễn Thanh Dương',
      'Trần Minh Phúc',
      'Huỳnh Diệp Sang',
      'Bùi Tấn Lân',
      'Phạm Đình Long',
      'Lê Nguyễn Trường Kỳ',
      'Phạm Đình Đức',
      'Nguyễn Thái Hòa',
      'Phạm Văn Lực',
      'Trương Thanh Lịch',
    ];
  }

  getStatus() {
    return [
      {
        name: 'Hủy hẹn',
        status: 'warning',
        bg: 'bg-warning-100',
      },
      {
        name: 'Đang hẹn',
        status: 'info',
        bg: 'bg-info-100',
      },
      {
        name: 'Quá hẹn',
        status: 'error',
        bg: 'bg-error-100',
      },
    ];
  }


  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

  // onClickSegment(date: WeekViewHourSegment) {
  //   this.lstData = [
  //     ...this.lstData,
  //     {
  //       start: date.date,
  //       end: setMinutes(
  //         setHours(date.date, this.getRandomInt(date.date.getHours(), 17)),
  //         this.getRandomInt(date.date.getMinutes(), 60)
  //       ),
  //       data: {
  //         name: this.getListName()[Math.floor(Math.random() * 22) + 0],
  //         doctor: this.getListName()[Math.floor(Math.random() * 22) + 0],
  //         status: this.getStatus()[Math.floor(Math.random() * 3)],
  //       },
  //     },
  //   ];
  // }
  onClickSegment(date: WeekViewHourSegment) {
    const currentDate = new Date();
    this.lstData = [
      ...this.lstData,
      {
        start: date.date,
        end: new Date(currentDate.getTime() + 60 * 60000),
        data: {
          name: this.getListName()[Math.floor(Math.random() * 22) + 0],
          doctor: this.getListName()[Math.floor(Math.random() * 22) + 0],
          status: this.getStatus()[Math.floor(Math.random() * 3)],
        },
      },
    ];
    console.log(this.lstData);

  }

  clickEvent(e: MouseEvent, event: TDSSafeAny) {
    e.stopImmediatePropagation();
    e.preventDefault();
    this.lstData = this.lstData.filter((f) => f != event);
  }

  onModelChange(e: TDSSafeAny) {
    this.mode = e;
  }

  onSelectDay(date: Date) {
    this.lstData = [
      ...this.lstData,
      {
        start: setHours(date, 8),
        end: setHours(date, 17),
        data: {
          name: this.getListName()[Math.floor(Math.random() * 22) + 0],
          doctor: this.getListName()[Math.floor(Math.random() * 22) + 0],
          status: this.getStatus()[Math.floor(Math.random() * 3)],
        },
      },
    ];
  }

  getMonthData(date: Date, event: TDSSafeAny): boolean {
    return isSameDay(date, event.start);
  }
}
