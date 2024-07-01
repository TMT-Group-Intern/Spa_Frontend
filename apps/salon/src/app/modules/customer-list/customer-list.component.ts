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
import { TDSToolTipModule } from 'tds-ui/tooltip';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSPaginationModule } from 'tds-ui/pagination';
import { TDSBreadCrumbModule } from 'tds-ui/breadcrumb';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { RouterLink } from '@angular/router';


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
    TDSToolTipModule,
    TDSButtonModule,
    TDSPaginationModule,
    TDSBreadCrumbModule,
    CustomerDetailComponent,
    RouterLink
  ],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit {

  private readonly tModalSvc =inject(TDSModalService)
  CustomerList:any[] = [];
  customerOfPage: any
  pageNumber: any = 1
  pageSize: any = 10
  totalItemsCustomers: any

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
    this.renderPageCustomers();
  }
  /* get the list of customers by pageNumber and pageSize */
  renderPageCustomers(): void {
    this.auth.pageCustomers(this.pageNumber, this.pageSize).subscribe((data:any) => {
      this.customerOfPage = data.item;
      this.totalItemsCustomers = data.totalItems;
    })
  }
  /*get back pageNumber*/
  changeNumberPage(event: number): void {
    this.pageNumber = event;
    this.renderPageCustomers();
  }
  // get back changeSizePage
  changeSizePage(event: number): void {
    this.pageSize = event;
    this.renderPageCustomers();
  }

  onRefresh(event: MouseEvent): void {
    console.log(event);
    this.pageNumber = 1;
    this.renderPageCustomers();
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
        this.renderPageCustomers();
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
        this.renderPageCustomers();
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
      tap(()=> { this.renderPageCustomers()})
    ).subscribe()
  }

}

