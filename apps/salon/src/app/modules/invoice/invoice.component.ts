import { InvoiceService } from './invoice.service';
import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { filter, tap } from 'rxjs';
import { TDSButtonModule } from 'tds-ui/button';
import { CompanyService } from '../../core/services/company.service';
import { AuthService } from '../../shared.service';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSTableModule } from 'tds-ui/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSInputNumberModule } from 'tds-ui/input-number';
import { TDSModalModule } from 'tds-ui/modal';
import { TDSDropDownModule } from 'tds-ui/dropdown';
import { TDSPipesModule } from 'tds-ui/core/pipes';
import { TDSRadioModule } from 'tds-ui/radio';
import { TDSTagModule } from 'tds-ui/tag';
import { DatePipe } from '@angular/common';
import { TDSListModule } from 'tds-ui/list';
import { TDSDataTableModule } from 'tds-ui/data-table';
import { TDSColumnSettingsModule } from 'tds-ui/column-settings';
import { UsersModalComponent } from '../users/users-modal/users-modal.component';
import { TDSTimelineModule } from 'tds-ui/timeline';
import { TDSToolTipModule } from 'tds-ui/tooltip';
import { TDSSelectModule } from 'tds-ui/select';
import { TDSCascaderModule } from 'tds-ui/cascader';
import { TDSPaginationModule } from 'tds-ui/pagination';


@Component({
  selector: 'frontend-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TDSButtonModule,
    TDSFormFieldModule,
    CommonModule,
    TDSTableModule,
    ReactiveFormsModule,
    TDSInputModule,
    TDSInputNumberModule,
    TDSModalModule,
    TDSDropDownModule,
    FormsModule,
    TDSPipesModule,
    TDSRadioModule,
    TDSTagModule,
    CommonModule,
    TDSListModule,
    TDSDataTableModule,
    TDSColumnSettingsModule,
    UsersModalComponent,
    TDSTimelineModule,
    TDSToolTipModule,
    TDSSelectModule,
    TDSCascaderModule,
    TDSPaginationModule,
  ]
})
export class InvoiceComponent implements OnInit {
  constructor(
    private invoiceSvc: InvoiceService
  ) { }
  private readonly sharedService = inject(AuthService);
  @Input() billId?: string;
  @Input() paymentID?: string;
  private readonly company = inject(CompanyService);
  branchId: any;
  branchInfo: any;
  billInfo: any;
  boolean$?: boolean = true;
  userSession: any;
  storedUserSession = localStorage.getItem('userSession');
  customerName = 'Nguyễn Văn A';
  currentDate = new Date().toLocaleDateString();
  employee:any;
  paymentInfo:any;
  listServices:any[]=[];
  total: any
  totalNeed:any;
  amountInvoiced:any;

  invoiceItems = [
    { productName: 'Sản phẩm 1', quantity: 2, price: 100000 },
    { productName: 'Sản phẩm 2', quantity: 1, price: 200000 },
    { productName: 'Sản phẩm 3', quantity: 3, price: 50000 }
  ];
  ngOnInit(): void {
    if (this.storedUserSession !== null) {
      this.userSession = JSON.parse(this.storedUserSession);
      this.branchId = this.userSession.user.branchID;
      this.employee = this.userSession.user.name;

    }
    this.company._companyIdCur$
      .pipe(
        filter((companyId) => !!companyId),
        tap((company) => company)
      )
      .subscribe((data) => (this.branchId = data));

    this.company._check_create$.pipe(
    ).subscribe(data => {
      this.boolean$ = data
    })
    this.getBranchInfo(this.branchId)
    const billId = this.billId
    const paymentId = this.paymentID
    if (billId != undefined && paymentId == undefined) {
      this.getBillInfo(billId)
    }
    else if (billId == undefined && paymentId != undefined){
      this.getPaymentInfo(paymentId)
    }
    
  }

  resetTotal() {
    this.total = 0
    for (const num of this.listServices) {
      this.total += num.totalPrice;
    }
  }

  getBranchInfo(id: number) {
    this.sharedService.getBranchById(id).subscribe(
      (branch: any) => {
        this.branchInfo = branch.branchDTO
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getBillInfo(billId: any) {
    this.sharedService.getBill(billId).subscribe(
      (bill: any) => {
        this.billInfo = bill
        this.paymentInfo=bill.payments[0]
        this.listServices=bill.billItems
        this.amountInvoiced=bill.amountInvoiced
        this.resetTotal()
      },
      (error) => {
        console.error(error)
      }
    )
  }

  getPaymentInfo(paymentId: any) {
    this.sharedService.getPaymentsById(paymentId).subscribe(
      (bill: any) => {
        this.billInfo = bill
        this.paymentInfo=bill.payments[0]
        this.listServices=bill.billItems
        this.amountInvoiced=bill.payments[0].amount
        this.resetTotal()
      },
      (error) => {
        console.error(error)
      }
    )
  }

  printInvoice() {
    this.hideElementsBeforePrint();
    window.print();
    this.restoreElementsAfterPrint();
  }

  hideElementsBeforePrint() {
    const elementsToHide = document.querySelectorAll('.tds-modal-close, .tds-modal-footer, .tds-modal-title,.tds-modal-header');
    elementsToHide.forEach((element: any) => {
      element.style.display = 'none';
    });
  }

  restoreElementsAfterPrint() {
    const elementsToRestore = document.querySelectorAll('.tds-modal-close, .tds-modal-footer, .tds-modal-title, .tds-modal-header');
    elementsToRestore.forEach((element: any) => {
      element.style.display = '';
    });
  }
}
