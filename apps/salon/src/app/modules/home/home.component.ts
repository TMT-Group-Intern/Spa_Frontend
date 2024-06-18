import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSButtonModule } from 'tds-ui/button';
import { AuthService } from '../../shared.service';
import { TDSCardModule } from 'tds-ui/card';
import { TDSHeaderModule } from 'tds-ui/header';

@Component({
  selector: 'frontend-home',
  standalone: true,
  imports: [
    CommonModule,
    TDSButtonModule,
    TDSCardModule,
    TDSHeaderModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  appointmentList: any[] = [];

  constructor(
    private sharedService : AuthService,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) {}

  // Display Appointment List
  private initAppointmentList() {
    this.sharedService.CustomerList().subscribe((data:any) => {
      this.appointmentList = data;
    });
  }

  ngOnInit(): void {
    this.initAppointmentList();
  }

}
