import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'frontend-payment-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss'],
})
export class PaymentModalComponent {}
