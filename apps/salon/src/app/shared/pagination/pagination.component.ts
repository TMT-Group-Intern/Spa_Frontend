import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TDSPaginationModule } from 'tds-ui/pagination';

@Component({
  selector: 'frontend-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  standalone: true ,
  imports:[CommonModule,ReactiveFormsModule, TDSPaginationModule]
})
export class PaginationComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() { }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
