import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TDSBreadCrumbModule } from 'tds-ui/breadcrumb';
import { AuthService } from '../../../shared.service';
import { TDSTabsModule } from 'tds-ui/tabs';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TDSEmptyModule } from 'tds-ui/empty';
import { TDSImageModule } from 'tds-ui/image';
import { ReactiveFormsModule } from '@angular/forms';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSTableModule } from 'tds-ui/table';
import { TDSTagModule } from 'tds-ui/tag';

@Component({
  selector: 'frontend-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TDSBreadCrumbModule,
    RouterLink,
    TDSTabsModule,
    UserProfileComponent,
    TDSEmptyModule,
    TDSImageModule,
    TDSFormFieldModule,
    TDSTableModule,
    TDSTagModule
  ],
})
export class CustomerDetailComponent implements OnInit {
  routeSub: Subscription | undefined;
  id: any;
  customer: any;
  serviceHistory: any;
  listOfData: any;

  constructor(private route: ActivatedRoute, private shared: AuthService) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      this.id = params['id']; // the value of id
    });

    this.shared.getCustomer(this.id).subscribe((data: any) => {
      this.customer = data;
    });
    this.treatmentHistory();
    this.billHistory()
  }
  treatmentHistory() {
    if (this.id) {
      this.shared.getHistoryCustomer(this.id).subscribe((data: any) => {
        this.serviceHistory = data.listHistoryForCus.sort((a: any, b: any) =>
          b.date < a.date ? -1 : 1
        );
      });
    }
  }
  billHistory(){
    if(this.id){
      this.shared.getBillHistory(this.id).subscribe((data: any)=>{
        this.listOfData = data.sort((a: any, b: any)=> a.date > b.date ? -1 :1);
      })
    }
  }
}
