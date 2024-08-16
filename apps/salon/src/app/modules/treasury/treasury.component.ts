import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared.service';
import { DOCUMENT } from '@angular/common';
import { PhieuthuchiComponent } from './phieuthuchi/phieuthuchi.component';
import { TDSModalService } from 'tds-ui/modal';

@Component({
  selector: 'frontend-treasury',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './treasury.component.html',
  styleUrls: ['./treasury.component.scss'],
})

export class TreasuryComponent implements OnInit {
  private readonly modalSvc = inject(TDSModalService);
  cash: any;
  bank: any;
  listThuChi: any;

  ngOnInit(): void {
    this.GetFinance()
    this.GetThuChi()
  }

  constructor(private shareApi: AuthService, @Inject(DOCUMENT) private document: Document) {

  }

  GetFinance() {
    this.shareApi.getFinance().subscribe(
      (data: any) => {
        console.log(data);
        this.cash = data.cash.toLocaleString('vi', { style: 'currency', currency: 'VND' });
        this.bank = data.bank.toLocaleString('vi', { style: 'currency', currency: 'VND' });
      }
    )
  }

  GetThuChi() {
    this.shareApi.getAllThuChi().subscribe(
      (data: any) => {
        console.log(data);
        this.listThuChi = [...data]
      }
    )
  }

  TaoPhieuThuChi() {
    const modal = this.modalSvc.create({
      title: 'Chuyển tiếp chăm sóc',
      content: PhieuthuchiComponent,
      footer: null,
      size: 'lg',
    });
    // modal.afterClose.asObservable().subscribe(() => {

    // });
  }

}
