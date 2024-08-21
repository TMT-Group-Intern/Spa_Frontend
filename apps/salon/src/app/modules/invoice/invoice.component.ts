import { InvoiceService } from './invoice.service';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('idInvoice') idInvoice!: ElementRef;
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
        console.log(this.billInfo)
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
        console.log(this.billInfo)
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

  // printInvoice() {
  //   this.hideElementsBeforePrint();
  //   window.print();
  //   this.restoreElementsAfterPrint();
  // }

  printInvoice() {
    const content = this.idInvoice.nativeElement.innerHTML;
    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write('<html><head><title>Print</title>');
      // Nhúng toàn bộ thư viện TailwindCSS
      doc.write('<style>');
      doc.write(`
        body { font-family: Arial, sans-serif; }
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .items-center { align-items: center; }
        .space-y-4 > * + * { margin-top: 1rem; }
        .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
        .font-bold { font-weight: 700; }
        .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
        .w-[50%] { width: 50%; }
        .w-[150px] { width: 150px; }
        .w-[250px] { width: 250px; }
        .whitespace-nowrap { white-space: nowrap; }
        .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
        .border-b-tds-border-width-m { border-bottom-width: 1px; border-color: #d1d5db; }
      `);
      doc.write('</style>');
      doc.write('</head><body>');
      const updatedContent = content.replace('../../../assets/', `${'/apps/salon/src/'}assets/`);
      doc.write(updatedContent);
      //doc.write(content);
      doc.write('</body></html>');
      doc.close();

      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      document.body.removeChild(iframe);
    }
  }

  // hideElementsBeforePrint() {
  //   const elementsToHide = document.querySelectorAll('.tds-modal-close, .tds-modal-footer, .tds-modal-title,.tds-modal-header');
  //   elementsToHide.forEach((element: any) => {
  //     element.style.display = 'none';
  //   });
  // }

  // restoreElementsAfterPrint() {
  //   const elementsToRestore = document.querySelectorAll('.tds-modal-close, .tds-modal-footer, .tds-modal-title, .tds-modal-header, .tds-notification-notice');
  //   elementsToRestore.forEach((element: any) => {
  //     element.style.display = '';
  //   });
  // }
}
