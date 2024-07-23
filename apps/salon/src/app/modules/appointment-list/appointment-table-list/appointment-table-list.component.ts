import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from '../../../shared.service';
import { DATE_CONFIG } from '../../../core/enums/date-format.enum';
import { format } from 'date-fns';
import { CompanyService } from '../../../core/services/company.service';
import { debounceTime, switchMap, filter, of, BehaviorSubject } from 'rxjs';
import { TTypeState } from '../appointment-list.component';


@Component({
  selector: 'frontend-appointment-table-list',
  templateUrl: './appointment-table-list.component.html',
  styleUrls: ['./appointment-table-list.component.scss'],
})
export class AppointmentTableListComponent implements OnChanges, OnInit{

  private readonly shareApi = inject(AuthService)
  private readonly company = inject(CompanyService)
  @Input() branchId?: number;
  @Input() tabCurStr!: TTypeState;
  @Input() startDay: string | undefined;
  @Input() endDay: string | undefined;
  @Input() search?: string;
  listOfData: any;
  temp: any;


  ngOnChanges(changes: SimpleChanges): void {
    if(changes['search']?.currentValue){
      this.listOfData = this.temp.filter((item: any) => {
        return item.customer.phone.toLowerCase().includes(this.search?.toLowerCase()) ||
               item.customer.firstName.toLowerCase().includes(this.search?.toLowerCase()) ||
               item.customer.lastName.toLowerCase().includes(this.search?.toLowerCase());
      });
    }
    if(changes['startDay']?.currentValue || changes['endDay']?.currentValue || changes['tabCurStr']?.currentValue || changes['branchId']?.currentValue){
      this.initAppointmentbyDays(this.startDay as string,this.endDay as string)
    }

  }

  ngOnInit(): void {
    this.initAppointmentbyDays(this.startDay as string,this.endDay as string)
  }

  initAppointmentbyDays(fromDate: string, toDate: string): void {
    this.shareApi
      .getAppointmentByDays(this.branchId as number, fromDate, toDate)
      .subscribe((data) => {
        this.temp = data.filter(
          (item: any) => item.status === this.tabCurStr
        );
        this.listOfData = this.temp.sort((a: any, b: any) => a.appointmentDate > b.appointmentDate? -1 : 1);
      });
  }
}
