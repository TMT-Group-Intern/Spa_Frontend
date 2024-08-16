import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TDSTableModule } from 'tds-ui/table';
import { CommonModule } from '@angular/common';
import { AuthService } from 'apps/salon/src/app/shared.service';
import { InvoiceComponent } from '../../../invoice/invoice.component';
import { TDSModalModule, TDSModalService } from 'tds-ui/modal';
import { tap } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSInputNumberModule } from 'tds-ui/input-number';
import { TDSDropDownModule } from 'tds-ui/dropdown';
import { TDSPipesModule } from 'tds-ui/core/pipes';
import { TDSRadioModule } from 'tds-ui/radio';
import { TDSTagModule } from 'tds-ui/tag';
import { TDSToolTipModule } from 'tds-ui/tooltip';

@Component({
  selector: 'frontend-customer-detail-paymenthistory-table',
  templateUrl: './customer-detail-paymenthistory-table.component.html',
  styleUrls: ['./customer-detail-paymenthistory-table.component.scss'],
  standalone:true,
  imports:[
    TDSTableModule,
    CommonModule,
    CommonModule,
    TDSTableModule,
    ReactiveFormsModule,
    TDSFormFieldModule,
    TDSInputModule,
    TDSButtonModule,
    TDSInputNumberModule,
    TDSModalModule,
    TDSDropDownModule,
    FormsModule,
    TDSPipesModule,
    TDSRadioModule,
    TDSTagModule,
    TDSToolTipModule,
  ]
})
export class CustomerDetailPaymenthistoryTableComponent implements OnInit{
  private readonly sharedServices = inject(AuthService)
  private readonly tModalSvc = inject(TDSModalService);

  @Input() billId?: number;
  @Input() paymentID?:number;
  listOfDataDetail: any;

  constructor(
    private sharedService: AuthService
  ){}

  ngOnInit(): void {
    if(this.billId){
      this.onPaymentHistoryDetail(this.billId);
    }
  }

  onInvoice(paymentID:any) {
    const modal = this.tModalSvc.create({
      title: 'In hóa đơn',
      content: InvoiceComponent,
      footer: null,
      size: 'xl',
      componentParams: {
        paymentID
      }
    });
    modal.afterClose.asObservable().subscribe()
}

  onPaymentHistoryDetail(id: number): void {
    this.sharedServices
      .getPaymentHistory(id)
      .subscribe((data: any) => {
        this.listOfDataDetail = data;
      });
  }
}
