import { InvoiceService } from './invoice.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TDSButtonModule } from 'tds-ui/button';

@Component({
  selector: 'frontend-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
  standalone: true,
  imports:[
    CommonModule,
    TDSButtonModule
  ]
})
export class InvoiceComponent{
  constructor(
    private invoiceSvc: InvoiceService
  ){}
  customerName = 'Nguyễn Văn A';
  currentDate = new Date().toLocaleDateString();

  invoiceItems = [
    { productName: 'Sản phẩm 1', quantity: 2, price: 100000 },
    { productName: 'Sản phẩm 2', quantity: 1, price: 200000 },
    { productName: 'Sản phẩm 3', quantity: 3, price: 50000 }
  ];
  getTotal() {
    return this.invoiceItems.reduce((total, item) => total + item.quantity * item.price, 0);
  }

  printInvoice() {
    console.log(this.invoiceSvc.dataShare)
    window.print();
  }
}
