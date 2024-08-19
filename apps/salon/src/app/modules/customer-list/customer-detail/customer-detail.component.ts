import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription, switchMap, tap } from 'rxjs';
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
import { CustomerDetailPaymenthistoryTableComponent } from "./customer-detail-paymenthistory-table/customer-detail-paymenthistory-table.component";
import { PaymentModalComponent } from '../../home/payment-modal/payment-modal.component';
import { InvoiceComponent } from '../../invoice/invoice.component';
import { TDSToolTipModule } from 'tds-ui/tooltip';
import { TDSButtonModule } from 'tds-ui/button';

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
    TDSTagModule,
    TDSButtonModule,
    CustomerDetailPaymenthistoryTableComponent,
    TDSToolTipModule,
],
})
export class CustomerDetailComponent implements OnInit {
  expandSet = new Set<number>();
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
  
  onInvoice(billId:any) {
    const modal = this.modalSvc.create({
      title: 'In hóa đơn',
      content: InvoiceComponent,
      footer: null,
      size: 'xl',
      componentParams: {
        billId
      }
    });
    modal.afterClose.asObservable().subscribe()
}

  billHistory(){
    if(this.id){
      this.shared.getBillHistory(this.id).subscribe((data: any)=>{
        this.listOfData = data.sort((a: any, b: any)=> a.date > b.date ? -1 :1);
      })
    }
  }

  updateBill(id: number) {
    this.shared.getAllBillByAppointmentID(id).subscribe((data) => {
      if (data) {
        const billID = data.billID;
        const modal = this.modalSvc.create({
          title: 'Thanh toán',
          content: PaymentModalComponent,
          footer: null,
          size: 'xl',
          componentParams: {
            id,
            billID,
          },
        });
        modal.afterClose.asObservable().subscribe((res) => {
          if (res) {
            this.getCustomerDetails();
            this.treatmentHistory();
            this.billHistory();
          }
        });
      } else {
        const modal = this.modalSvc.create({
          title: 'Tạo hóa đơn',
          content: BillModalComponent,
          footer: null,
          size: 'xl',
          componentParams: {
            id,
          },
        });
        modal.afterClose.asObservable().subscribe((res) => {
          if (res) {
            this.getCustomerDetails();
            this.treatmentHistory();
            this.billHistory();
          }
        });
      }
    });
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
        this.expandSet.add(id);
    } else {
        this.expandSet.delete(id);
    }
}
}
