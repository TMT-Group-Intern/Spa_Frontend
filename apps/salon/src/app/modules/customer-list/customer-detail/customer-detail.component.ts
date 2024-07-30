import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { TDSBreadCrumbModule } from 'tds-ui/breadcrumb';
import { AuthService } from '../../../shared.service';
import { TDSListModule } from 'tds-ui/list';
import { TDSDataTableModule } from 'tds-ui/data-table';
import { TDSColumnSettingsModule } from 'tds-ui/column-settings';
import { TDSTabsModule } from 'tds-ui/tabs';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TDSEmptyModule } from 'tds-ui/empty';
import { TDSImageModule } from 'tds-ui/image';
import { ReactiveFormsModule } from '@angular/forms';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSTableModule } from 'tds-ui/table';
import { TDSTagModule } from 'tds-ui/tag';
import { BillModalComponent } from '../../home/bill-modal/bill-modal.component';
import { TDSModalService } from 'tds-ui/modal';

@Component({
  selector: 'frontend-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TDSBreadCrumbModule,
    RouterLink,
    TDSListModule,
    TDSDataTableModule,
    TDSColumnSettingsModule,
    TDSTabsModule,
    UserProfileComponent,
    TDSEmptyModule,
    TDSImageModule,
    TDSFormFieldModule,
    TDSTableModule,
    TDSTagModule
  ],
})
export class CustomerDetailComponent implements OnInit {
  routeSub: Subscription | undefined;
  id: any;
  customer: any={};
  serviceHistory: any;
  listOfData: any;
  billsOfCus: any;
  customerID: any;
  private readonly modalSvc = inject(TDSModalService);

  constructor(
    private route: ActivatedRoute,
    private shared: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const storedCustomerID = localStorage.getItem('customerID');
    // this.routeSub = this.route.params.subscribe(
    //   (params) => {
    //     this.id = params['id'];
    //     this.getCustomerDetails();
    //     this.treatmentHistory();
    //     this.billHistory();
    //   }
    // );
        this.id=storedCustomerID;
        this.getCustomerDetails();
        this.treatmentHistory();
        this.billHistory();
  }

  getCustomerDetails() {
    this.shared.getCustomer(this.id).subscribe(
      (data:any) => {
        this.customer = data.customerDTO;
      }
    );
  }

  treatmentHistory() {
    if (this.id) {
      this.shared.getHistoryCustomer(this.id).subscribe((data: any) => {
        this.serviceHistory = data.listHistoryForCus.sort((a: any, b: any) =>
          b.date < a.date ? -1 : 1
        );
      });
    }
  }
  
  billHistory(){
    if(this.id){
      this.shared.getBillHistory(this.id).subscribe((data: any)=>{
        this.listOfData = data.sort((a: any, b: any)=> a.date > b.date ? -1 :1);
      })
    }
  }

  updateBill(id: number) {
    const modal = this.modalSvc.create({
      title: 'Xem hóa đơn',
      content: BillModalComponent,
      footer: null,
      size: 'xl',
      componentParams: {
        id,
      },
    });
    modal.afterClose.asObservable().subscribe((res) => {
      if (res) {
        this.billHistory()
      }
    });
    console.log(id)
  }
}
