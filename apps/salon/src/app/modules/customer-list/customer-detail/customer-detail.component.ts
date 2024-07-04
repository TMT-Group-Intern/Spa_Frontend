import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TDSBreadCrumbModule } from 'tds-ui/breadcrumb';
import { AuthService } from '../../../shared.service';

@Component({
  selector: 'frontend-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TDSBreadCrumbModule,
    RouterLink,
  ],
})
export class CustomerDetailComponent implements OnInit {

  routeSub: Subscription | undefined
  id: any
  customer: any

  constructor(
    private route: ActivatedRoute,
    private shared: AuthService,
  ) { }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.id = params['id'] // the value of id
    });

    this.shared.getCustomer(this.id).subscribe(
      (data: any) => {
        this.customer = data
      }
    )

  }

}
