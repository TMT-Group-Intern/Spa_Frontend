import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../shared.service';
import * as moment from 'moment';
import { TDSTableModule } from 'tds-ui/table';

@Component({
  selector: 'frontend-payment-modal',
  standalone: true,
  imports: [
    CommonModule,
    TDSTableModule,
  ],
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss'],
})
export class PaymentModalComponent implements OnInit {

  @Input() id?:number
  inforCus: any;
  service: any[] = [];

  constructor(
    private shared: AuthService
  ) {}

  ngOnInit(): void {

    if(this.id){
       this.shared.getAppointment(this.id).subscribe(
        (data: any) => {
          console.log(data)
          this.inforCus = data;
          this.service = data.ChooseServices;
        }
       )
    }

  }

  // Format Date & Time
  formatDate(date: string, format: string): string {
    return moment(date).format(format);
  }

}
