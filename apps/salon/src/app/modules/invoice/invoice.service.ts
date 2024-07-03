// Tạo file invoice.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  dataShare = new BehaviorSubject<any>(null);
  public someMethod() {
    // console.log('someMethod called from InvoiceService');

  }
}
