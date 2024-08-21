import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared.service';
import { PhieuthuchiComponent } from './phieuthuchi/phieuthuchi.component';
import { TDSModalService } from 'tds-ui/modal';
import { TDSTableModule } from "tds-ui/table";


@Component({
  selector: 'frontend-treasury',
  standalone: true,
  imports: [CommonModule, TDSTableModule],
  templateUrl: './treasury.component.html',
  styleUrls: ['./treasury.component.scss'],
})

export class TreasuryComponent implements OnInit {
  private readonly modalSvc = inject(TDSModalService);
  cash: any;
  bank: any;
  listThuChi: any;
  total: any;

  ngOnInit(): void {
    this.GetFinance()
    this.GetThuChi()
  }

  constructor(private shareApi: AuthService) {

  }

  GetFinance() {
    this.shareApi.getFinance().subscribe(
      (data: any) => {
        this.cash = data.respone.totalCash.toLocaleString('vi', { style: 'currency', currency: 'VND' });
        this.bank = data.respone.totalBank.toLocaleString('vi', { style: 'currency', currency: 'VND' });
      }
    )
  }

  GetThuChi() {
    this.shareApi.getAllThuChi().subscribe(
      (data: any) => {
        this.listThuChi = [...data.items]
        this.total = data.total
      }
    )
  }

  formatCurrency(amount: number): string {
    const isNegative = amount < 0;
    const absoluteAmount = Math.abs(amount);
    const formattedAmount = absoluteAmount.toLocaleString('vi', {
      style: 'currency',
      currency: 'VND'
    });
    return isNegative ? `-${formattedAmount}` : formattedAmount;
  }

  TaoPhieuThuChi() {
    const modal = this.modalSvc.create({
      title: 'Tạo Phiếu Thu/Chi',
      content: PhieuthuchiComponent,
      footer: null,
      size: 'lg',
    });
    modal.afterClose.asObservable().subscribe(() => {
      this.GetFinance()
      this.GetThuChi()
    });
  }

}
