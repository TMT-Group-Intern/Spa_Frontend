import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'frontend-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {}
