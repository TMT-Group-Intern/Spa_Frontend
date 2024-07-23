import { TDSTagModule } from 'tds-ui/tag';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSCalendarModule, WeekViewHourSegment } from 'tds-ui/calendar';
import { ReactiveFormsModule } from '@angular/forms';
import { TDSButtonModule } from 'tds-ui/button';
import { format, isSameDay, setHours, setMinutes } from 'date-fns';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSCalendarMode } from 'tds-ui/date-picker';
import { AuthService } from '../../shared.service';
import { concatMap, filter } from 'rxjs';
import { CompanyService } from '../../core/services/company.service';
import { da } from 'date-fns/locale';
import { TDSModalService } from 'tds-ui/modal';
import { AppointmentModalComponent } from '../home/appointment-modal/appointment-modal.component';
import { DATE_CONFIG } from '../../core/enums/date-format.enum';
import { TDSSegmentedModule } from 'tds-ui/segmented';

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
    // TDSSegmentedModule,
  ],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SchedulesComponent implements OnInit {
  private readonly shareApi = inject(AuthService);
  private readonly company = inject(CompanyService);
  private readonly modalSvc = inject(TDSModalService);
  private cdr = inject(ChangeDetectorRef);
  dayStartHour = 8;
  dayEndHour = 17;
  date = new Date();
  mode: TDSCalendarMode = 'date';
  lstData: Array<{ start: Date; end: Date; data: TDSSafeAny }> = [];
  dataAppointments: any;
  public userSession: any;
  storedUserSession = localStorage.getItem('userSession');
  // options = ['Chờ chăm sóc', 'Thanh toán'];

  ngOnInit(): void {
    if (this.storedUserSession !== null) {
      this.userSession = JSON.parse(this.storedUserSession);
      this.initAppointment();
    }

    this.company._companyIdCur$
      .pipe(
        filter((companyId) => !!companyId),
        concatMap((brachID) => {
          console.log('id1: ', brachID);
          return this.shareApi.appointmentList(brachID as number);
        })
      )
      .subscribe((data: any) => {
        this.dataAppointments = data;
        console.log(this.dataAppointments);
        this.lstData = this.dataAppointments.map((item: any) => ({
          start: new Date(item.AppointmentDate),
          end: new Date(new Date(item.AppointmentDate).getTime() + 60 * 60000),
          data: {
            name: item.Customer.FirstName + ' ' + item.Customer.LastName,
            doctor: item.Doctor,
            status: {
              name: item.Status,
              status: 'info',
              bg: 'bg-error-100',
            },
          },
        }));
      });
    console.log(this.lstData);
  }

  // call get list of appoiment
  initAppointment() {
    const branchID = this.userSession.user.branchID
    this.shareApi.appointmentList(branchID).subscribe((data: any) => {
      this.dataAppointments = data
      console.log(this.dataAppointments);
      this.lstData = this.dataAppointments.map((item:any)=>({
        start: new Date(item.AppointmentDate),
        end: new Date(new Date(item.AppointmentDate).getTime() + 60 * 60000),
        data:{
          name:item.Customer.FirstName +' '+ item.Customer.LastName,
          doctor:item.Doctor,
          status: {
            name: item.Status,
            "status": "info",
            "bg": "bg-error-100"
        }
        }
      }))
    });
  }


  onClickSegment(date: WeekViewHourSegment) {
    const modal = this.modalSvc.create({
      title:'Tạo lịch hẹn',
      content: AppointmentModalComponent,
      footer: null,
      size:'lg',
      componentParams:{
        formatTime: format(new Date(date.date as Date),DATE_CONFIG.DATE_BASE )
      }
    })
    modal.afterClose.asObservable().subscribe(
      (e: any) => {
        console.log()
        this.initAppointment();
      }
    )
  }

  clickEvent(e: MouseEvent, event: TDSSafeAny) {
    console.log(2);
    e.stopImmediatePropagation();
    e.preventDefault();
    this.lstData = this.lstData.filter((f) => f != event);
  }

  onModelChange(e: TDSSafeAny) {
    this.mode = e;
  }

  // onSelectDay(date: Date) {
  //   console.log(3);
  //   this.lstData = [
  //     ...this.lstData,
  //     {
  //       start: setHours(date, 8),
  //       end: setHours(date, 17),
  //       data: {
  //         name: this.getListName()[Math.floor(Math.random() * 22) + 0],
  //         doctor: this.getListName()[Math.floor(Math.random() * 22) + 0],
  //         status: this.getStatus()[Math.floor(Math.random() * 3)],
  //       },
  //     },
  //   ];
  // }

  getMonthData(date: Date, event: TDSSafeAny): boolean {
    console.log(4);
    return isSameDay(date, event.start);
  }
}
