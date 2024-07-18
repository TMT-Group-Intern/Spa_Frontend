import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { TDSBreadCrumbModule } from 'tds-ui/breadcrumb';
import { AuthService } from '../../../shared.service';
import { TDSListModule } from 'tds-ui/list';
import { TDSDataTableModule } from 'tds-ui/data-table';
import { TDSColumnSettingsModule } from 'tds-ui/column-settings';

@Component({
  selector: 'frontend-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TDSBreadCrumbModule,
    RouterLink,
    TDSListModule,
    TDSDataTableModule,
    TDSColumnSettingsModule,
  ],
})
export class CustomerDetailComponent implements OnInit {

  routeSub: Subscription | undefined
  id: any
  customer: any
  billsOfCus: any

  constructor(
    private route: ActivatedRoute,
    private shared: AuthService,
  ) { }

  ngOnInit(): void {
    this.routeSub = this.route.params.pipe(
      switchMap(params => this.shared.getCustomer(params['id']))
    ).subscribe(
      (data) => {
      this.customer = data
    });

    this.shared.getCustomer(this.id).subscribe(
      (data: any) => {
        this.customer = data
      }
    )

  }

}
