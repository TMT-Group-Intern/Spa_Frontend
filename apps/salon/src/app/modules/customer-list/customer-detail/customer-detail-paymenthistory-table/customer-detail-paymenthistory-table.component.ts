import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from 'apps/salon/src/app/shared.service';
import { TDSTableModule } from 'tds-ui/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'frontend-customer-detail-paymenthistory-table',
  templateUrl: './customer-detail-paymenthistory-table.component.html',
  styleUrls: ['./customer-detail-paymenthistory-table.component.scss'],
  standalone:true,
  imports:[
    TDSTableModule,
    CommonModule
  ]
})
export class CustomerDetailPaymenthistoryTableComponent implements OnInit{
  private readonly sharedServices = inject(AuthService)

  @Input() billId?: number;
  listOfDataDetail: any;

  constructor(
    private sharedService: AuthService
  ){}

  ngOnInit(): void {
    if(this.billId){
      this.onPaymentHistoryDetail(this.billId);
    }
  }

  onPaymentHistoryDetail(id: number): void {
    this.sharedServices
      .getPaymentHistory(id)
      .subscribe((data: any) => {
        this.listOfDataDetail = data;
      });
  }
}
