import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from '../../../shared.service';
import { CompanyService } from '../../../core/services/company.service';
import { TTypeState } from '../appointment-list.component';
import { FormControl, Validators } from '@angular/forms';
import { TDSModalService } from 'tds-ui/modal';
import { AppointmentModalComponent } from '../../home/appointment-modal/appointment-modal.component';


@Component({
  selector: 'frontend-appointment-table-list',
  templateUrl: './appointment-table-list.component.html',
  styleUrls: ['./appointment-table-list.component.scss'],
})
export class AppointmentTableListComponent implements OnChanges, OnInit{

  private readonly shareApi = inject(AuthService)
  private readonly modalSvc = inject(TDSModalService)
  @Input() branchId?: number;
  @Input() tabCurStr!: TTypeState;
  @Input() startDay: string | undefined;
  @Input() endDay: string | undefined;
  @Input() search?:string;
  listOfData: any;
  listOfAllData: any;
  temp: any;
  persondisplayWith!: FormControl;

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['search']?.currentValue ||this.search === ''){
      if(this.search === '' ){
        this.listOfData = this.temp;
      }else{
        this.listOfData =[... this.temp.filter((item: any) => {
          return item.customer.phone.toLowerCase().includes(this.search?.toLowerCase()) ||
                 item.customer.firstName.toLowerCase().includes(this.search?.toLowerCase()) ||
                 item.customer.lastName.toLowerCase().includes(this.search?.toLowerCase());
        })];
      }
    }
    if(changes['startDay']?.currentValue || changes['endDay']?.currentValue || changes['tabCurStr']?.currentValue  || changes['branchId']?.currentValue){
      this.initAppointmentbyDays(this.startDay as string,this.endDay as string)
    }
  }

  ngOnInit(): void {
    this.initAppointmentbyDays(this.startDay as string,this.endDay as string)
    this.persondisplayWith = new FormControl(null, Validators.required);
  }

  initAppointmentbyDays(fromDate: string, toDate: string): void {
    this.shareApi
      .getAppointmentByDays(this.branchId as number, fromDate, toDate)
      .subscribe((data) => {
        if(this.tabCurStr === 'Tất cả'){
          this.temp = data
        }else{
          this.temp = data.filter(
            (item: any) => item.status === this.tabCurStr
          );
        }
        this.listOfData = [...this.temp.sort((a: any, b: any) => a.appointmentDate > b.appointmentDate? -1 : 1)];
      });
  }

updateAppointmentStatus(idAppointment: number, statusAppointment: string): void {
  this.shareApi.UpdateStatus(idAppointment, statusAppointment).subscribe(
    () => {
      this.initAppointmentbyDays(this.startDay as string,this.endDay as string)
    }
  )
}

callModalEditAppointment(id: number){
  this.modalSvc.create({
    title:'Sửa lịch hẹn',
    content: AppointmentModalComponent,
    footer: null,
    size:'lg',
    componentParams:{
      id: id
    }
  })
}
}
