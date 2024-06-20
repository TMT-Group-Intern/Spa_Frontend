import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSButtonModule } from 'tds-ui/button';
import { AuthService } from '../../shared.service';
import { TDSCardModule } from 'tds-ui/card';
import { TDSHeaderModule } from 'tds-ui/header';
import * as moment from 'moment';
import { TDSTagModule } from 'tds-ui/tag';
import { TDSModalService } from 'tds-ui/modal';
import { AppointmentModalComponent } from './appointment-modal/appointment-modal.component';
import { TDSToolTipModule } from 'tds-ui/tooltip';

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
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {

  private readonly tModalSvc =inject(TDSModalService)
  appointmentList: any[] = [];
  time: any;

  constructor(
    private sharedService : AuthService,
  ) {}

  // Display Appointment List
  initAppointmentList() {
    this.sharedService.appointmentList(1).subscribe((data:any) => {
      this.appointmentList = data;
    });
  }

  // Format Date & Time
  formatDate(date: string, format: string): string {
    return moment(date).format(format);
  }

  ngOnInit(): void {
    this.initAppointmentList();
  }

  createAppointment(){
    const modal = this.tModalSvc.create({
      title:'Create Appointment',
      content: AppointmentModalComponent,
      footer:null,
      size:'lg'
    });
    modal.afterClose.asObservable().subscribe(res=>{
      if(res){
        this.initAppointmentList()
      }
    })
  }

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

}
