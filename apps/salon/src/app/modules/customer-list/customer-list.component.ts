import { TDSDataTableModule } from 'tds-ui/data-table';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSColumnSettingsModule } from 'tds-ui/column-settings';
import { TDSListModule } from 'tds-ui/list';
import { AuthService } from '../../shared.service';
import { TDSModalService } from 'tds-ui/modal';
import { CustomerModalComponent } from './customer-modal/customer-modal.component';
import { concatMap, filter, tap } from 'rxjs';
import { TDSTimelineModule } from 'tds-ui/timeline';


@Component({
  selector: 'frontend-customer-list',
  standalone: true,
  imports: [
    CommonModule,
    TDSListModule,
    TDSDataTableModule,
    TDSColumnSettingsModule,
    CustomerModalComponent,
    TDSTimelineModule,
  ],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit {
  private readonly tModalSvc =inject(TDSModalService)
  CustomerList:any[] = [];

  constructor(
    private auth : AuthService,
  ) {}

  // Display Customer List
  private initCustomerList() {
    this.auth.CustomerList().subscribe((data:any) => {
      this.CustomerList = data.item;
    });
  }

  ngOnInit(): void {
    this.initCustomerList();
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

