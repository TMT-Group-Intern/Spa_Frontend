import { TDSEmptyModule } from 'tds-ui/empty';
import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSCardModule } from 'tds-ui/card';
import { TDSTagModule } from 'tds-ui/tag';
import { AuthService } from '../../shared.service';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSTypographyModule } from 'tds-ui/typography';
import { TDSModalService } from 'tds-ui/modal';
import { ServiceAppointmentModalComponent } from '../home/service-appointment-modal/service-appointment-modal.component';
import { TDSTimePickerModule } from 'tds-ui/time-picker';
import { TDSHeaderModule } from 'tds-ui/header';
import { TDSImageModule } from 'tds-ui/image';
import { ReactiveFormsModule } from '@angular/forms';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSToolTipModule } from 'tds-ui/tooltip';

@Component({
  selector: 'frontend-doctor',
  standalone: true,
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TDSCardModule,
    TDSTagModule,
    TDSButtonModule,
    TDSTypographyModule,
    TDSTimePickerModule,
    TDSHeaderModule,
    TDSCardModule,
    TDSImageModule,
    TDSFormFieldModule,
    TDSEmptyModule,
    TDSToolTipModule
  ]
})
export class DoctorComponent implements OnInit {
  private readonly tModalSvc = inject(TDSModalService)

  reception: any[] = [];
  appointmentList: any;
  @Input() customerId?: number;
  private readonly shared = inject(AuthService)
  serviceHistory: any;
  fallback = "./assets/img/default.svg";
  dataAppointmentbyid: any;

  constructor(
    private sharedService: AuthService,
  ) { }

  ngOnInit(): void {
    this.initAppointmentList();
  }

  // Display Appointment List
  initAppointmentList() {
    this.sharedService.appointmentList(2).subscribe(
      (data: any) => {
        console.log(data);
        this.appointmentList = data;
        console.log(data.CustomerID)
        this.reception = this.appointmentList.filter((appointment: any) =>
          appointment.Status === "Examining"
        );
      });
  }

  // Open Service Appointment Modal
  callmodalServiceAppointment(id: number) {
    const modal = this.tModalSvc.create({
      title: 'Tạo dịch vụ',
      content: ServiceAppointmentModalComponent,
      footer: null,
      size: 'lg',
      componentParams: {
        id
      }
    });
    modal.afterClose.asObservable().subscribe(res => {
      if (res) {
        this.initAppointmentList()
      }
    })
  }

  userFrofile(id: number) {
    this.sharedService.getAppointment(id).subscribe((data: any) => {
      console.log(data),
        this.dataAppointmentbyid = data;
    }
    )
  }

  getHistory(id: number) {
    this.sharedService.getHistoryCustomer(id).subscribe((data: any) => {
      this.serviceHistory = data.listHistoryForCus;
      console.log(this.serviceHistory);
    })
  }
}
