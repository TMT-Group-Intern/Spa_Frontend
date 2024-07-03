import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSCardModule } from 'tds-ui/card';
import { TDSTagModule } from 'tds-ui/tag';
import { AuthService } from '../../shared.service';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSTypographyModule } from 'tds-ui/typography';

@Component({
  selector: 'frontend-doctor',
  standalone: true,
  imports: [
    CommonModule,
    TDSCardModule,
    TDSTagModule,
    TDSButtonModule,
    TDSTypographyModule,
  ],
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss'],
})
export class DoctorComponent implements OnInit {

  reception: any[] = [];
  appointmentList: any[] = [];

  constructor(
    private sharedService: AuthService,
  ) { }

  ngOnInit(): void {
    this.initAppointmentList()
  }

  // Display Appointment List
  initAppointmentList() {
    this.sharedService.appointmentList(1).subscribe(
      (data: any) => {
        this.appointmentList = data;
        this.reception = this.appointmentList.filter((appointment: any) =>
          appointment.Status === "Examining"
        );
      });
  }

}
