import { ServiceAppointmentModalComponent } from './service-appointment-modal/service-appointment-modal.component';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSButtonModule } from 'tds-ui/button';
import { AuthService } from '../../shared.service';
import { TDSCardModule } from 'tds-ui/card';
import { TDSHeaderModule } from 'tds-ui/header';
import * as moment from 'moment'; // npm install moment --f
import { TDSTagModule } from 'tds-ui/tag';
import { TDSModalService } from 'tds-ui/modal';
import { AppointmentModalComponent } from './appointment-modal/appointment-modal.component';
import { TDSToolTipModule } from 'tds-ui/tooltip';
import { TDSTypographyModule } from 'tds-ui/typography';
import { TDSFormFieldModule } from 'tds-ui/form-field';

@Component({
  selector: 'frontend-home',
  standalone: true,
  imports: [
    CommonModule,
    TDSButtonModule,
    TDSCardModule,
    TDSHeaderModule,
    TDSTagModule,
    TDSToolTipModule,
    TDSTypographyModule,
    TDSFormFieldModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {


  private readonly tModalSvc =inject(TDSModalService)
  appointmentList: any[] = [];
  time: any;
  todayBooking: any[] = [];
  reception: any[] = [];
  inSession: any[] = [];
  status: any

  constructor(
    private sharedService : AuthService,
  ) {}

  ngOnInit(): void {
    this.initAppointmentList();
    // console.log(this.statusOptions)
  }
  // Display Appointment List
  initAppointmentList() {
    this.sharedService.appointmentList(1).subscribe((data:any) => {
      this.appointmentList = data;
      this.todayBooking = this.appointmentList.filter((appointment: any) =>
        appointment.Status === "Scheduled" ||
        appointment.Status === "Confirmed" ||
        appointment.Status === "Cancelled"
      );

      this.reception = this.appointmentList.filter((appointment: any) =>
        appointment.Status === "Waiting" ||
        appointment.Status === "Examining"
      );

      this.inSession = this.appointmentList.filter((appointment: any) =>
        appointment.Status === "Preparation" ||
        appointment.Status === "Treating"
      );
    });
  }

  // Format Date & Time
  formatDate(date: string, format: string): string {
    return moment(date).format(format);
  }

  // Open Create Appointment Modal
  createAppointment(){
    const modal = this.tModalSvc.create({
      title:'Create Appointment',
      content: AppointmentModalComponent,
      footer:null,
      size:'lg'
    });
    modal.afterClose.asObservable().subscribe(res=>{
      if(res){
        console.log(res)
        this.initAppointmentList()
      }
    })
  }

  // Open Service Appointment Modal
  callmodalServiceAppointment(id:number){
    const modal = this.tModalSvc.create({
      title:'Create service appointment',
      content: ServiceAppointmentModalComponent,
      footer:null,
      size:'lg',
      componentParams:{
        id
      }
    });
    modal.afterClose.asObservable().subscribe(res=>{
      if(res){
        this.initAppointmentList()
      }
    })
  }

  // Open Edit Appointment Modal
  onEditAppointment(id:number){
    const modal = this.tModalSvc.create({
      title:'Edit Appointment',
      content: AppointmentModalComponent,
      footer:null,
      size:'lg',
      componentParams:{
        id
      }
    });
    modal.afterClose.asObservable().subscribe(res=>{
      if(res){
        this.initAppointmentList()
      }
    })
  }

  // Update Status
  updateStatus(id: number, status: string) {
    this.sharedService.UpdateStatus(id, status).subscribe(
      () => {
        this.sharedService.getAppointment(id).subscribe(
          (res: any) => {
            console.log(res)
          }
        )
        this.initAppointmentList()
      }
    );
  }

}
