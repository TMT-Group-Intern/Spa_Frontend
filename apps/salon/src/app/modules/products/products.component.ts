import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSCalendarModule } from 'tds-ui/calendar';
import { ReactiveFormsModule } from '@angular/forms';
import { InvoiceComponent } from "../invoice/invoice.component";

@Component({
    selector: 'frontend-products',
    standalone: true,
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss'],
    imports: [CommonModule, ReactiveFormsModule, TDSCalendarModule, InvoiceComponent]
})
export class ProductsComponent {
  selectedDate: Date;
  minDate: Date;
  maxDate: Date;
  customDayNames: string[];
  times: string[];

  constructor() {
    this.selectedDate = new Date();
    this.minDate = new Date(2020, 0, 1);
    this.maxDate = new Date(2030, 11, 31);
    this.customDayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    this.times = this.generateTimes();
  }

  onDateChange(event: any) {
    console.log('Date changed:', event);
  }

  generateTimes(): string[] {
    const times = [];
    for (let i = 0; i < 24; i++) {
      const timeString = i < 10 ? `0${i}:00` : `${i}:00`;
      times.push(timeString);
    }
    return times;
  }

}
