import { TDSDataTableModule } from 'tds-ui/data-table';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSColumnSettingsModule } from 'tds-ui/column-settings';
import { TDSListModule } from 'tds-ui/list';
import { AuthService } from '../../services/auth.service';
import { CreateCustomerComponent } from './create-customer/create-customer.component';


@Component({
  selector: 'frontend-customer-list',
  standalone: true,
  imports: [
    CommonModule,
    TDSListModule,
    TDSDataTableModule,
    TDSColumnSettingsModule,
    CreateCustomerComponent,
  ],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit {

  CustomerList:any[] = [];

  constructor(
    private auth : AuthService,
  ) {}

  // Display Customer List
  showCustomerList() {
    this.auth.CustomerList().subscribe(data => {
      this.CustomerList = data;
      console.log('CustomerList:', this.CustomerList)
    });
  }

  ngOnInit(): void {

    this.showCustomerList();

  }

}

// interface RootObject {
//   customerID: number;
//   firstName: string;
//   customerCode: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   dateOfBirth: string;
//   gender: string;
//   customerTypeID: number;
//   appointments: null;
//   sales: null;
//   customerType: null;
// }
