import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSListModule } from 'tds-ui/list';
import { TDSDataTableModule } from 'tds-ui/data-table';
import { TDSColumnSettingsModule } from 'tds-ui/column-settings';
import { CustomerModalComponent } from '../customer-list/customer-modal/customer-modal.component';
import { TDSTimelineModule } from 'tds-ui/timeline';
import { TDSToolTipModule } from 'tds-ui/tooltip';
import { TDSModalService } from 'tds-ui/modal';
import { AuthService } from '../../shared.service';
import { concatMap, filter, tap } from 'rxjs';
import { TDSButtonModule } from 'tds-ui/button';

@Component({
  selector: 'frontend-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    TDSListModule,
    TDSDataTableModule,
    TDSColumnSettingsModule,
    CustomerModalComponent,
    TDSTimelineModule,
    TDSToolTipModule,
    TDSButtonModule,
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit{

  private readonly tModalSvc =inject(TDSModalService)
  CustomerList:any[] = [];

  constructor(
    private auth : AuthService,
  ) {}

  // Display Customer List
  private initCustomerList() {
    this.auth.CustomerList().subscribe(data => {
      this.CustomerList = data;
    });
  }

  ngOnInit(): void {
    this.initCustomerList();
    // console.log('API URL:', BASE_URI);
  }

  createCustomer(){
    const modal = this.tModalSvc.create({
      title:'Create Customer',
      content: CustomerModalComponent,
      footer:null,
      size:'lg'
    });
    modal.afterClose.asObservable().subscribe(res=>{
      if(res){
        this.initCustomerList()
      }
    })
  }

  onEditCustomer(id:number){
    const modal = this.tModalSvc.create({
      title:'Edit Customer',
      content: CustomerModalComponent,
      footer:null,
      size:'lg',
      componentParams:{
        id
      }
    });
    modal.afterClose.asObservable().subscribe(res=>{
      if(res){
        this.initCustomerList()
      }
    })
  }

  deleteCustomer(id:number){
    const modal = this.tModalSvc.error({
      title:'Delete Customer',
      content: `<h5 class="text-error-500">Your action cannot return after deleted!</h5>`,
      iconType:'tdsi-trash-line',
      okText:'Delete',
      size: 'md',
      cancelText:'Hủy',
      onOk:()=> true
    });
    modal.afterClose.asObservable().pipe(
      filter(condition => condition),
      concatMap(_=> this.auth.deleteCustomer(id)),
      tap(()=>  this.initCustomerList())
    ).subscribe()
  }

}
