/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-empty-function */
import { TDSMapperPipeModule } from 'tds-ui/cdk/pipes/mapper';
import { TDSDataTableModule } from 'tds-ui/data-table';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSColumnSettingsModule } from 'tds-ui/column-settings';
import { TDSListModule } from 'tds-ui/list';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TDSAvatarModule } from 'tds-ui/avatar';
import { TDSModalModule } from 'tds-ui/modal';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSSelectModule } from 'tds-ui/select';
import { TDSRadioModule } from 'tds-ui/radio';

@Component({
  selector: 'frontend-customer-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TDSListModule,
    TDSDataTableModule,
    TDSColumnSettingsModule,
    TDSAvatarModule,
    TDSMapperPipeModule,
    TDSModalModule,
    TDSFormFieldModule,
    TDSSelectModule,
    TDSRadioModule
  ],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit {

  isVisible = false;
  radioValue = 'A';
  signUpForm!: FormGroup;
  CustomerList:any[] = [];

  constructor(
    private fb: FormBuilder,
    private auth : AuthService,
    private router:Router,
  ) {}

  // Display modal
  showModal(): void {
    this.isVisible = true;
  }


  // Save button
  handleOk(): void {
    console.log("Button ok clicked!");
    this.isVisible = false;
  }

  // Cancel button
  handleCancel(): void {
    console.log("Button cancel clicked!");
    this.isVisible = false;
  }

//   persondisplayWith!: FormControl;
//   public contactOptions = [
//     { id: 1, name: 'Elton John' },
//     { id: 2, name: 'Elvis Presley' },
//     { id: 3, name: 'Paul McCartney' },
//     { id: 4, name: 'Elton John' },
//     { id: 5, name: 'Elvis Presley' },
//     { id: 6, name: 'Paul McCartney' },
// ``]

  // Display Customer List
  showCustomerList() {
    this.auth.CustomerList().subscribe(data => {
      this.CustomerList = data;
      console.log('CustomerList:', this.CustomerList)
    });
  }

  ngOnInit(): void {

    this.showCustomerList();

    // this.signUpForm = this.fb.group({
    //   // phoneNumber: ['', Validators.compose([
    //   //     Validators.required,
    //   //     Validators.pattern(/^[0-9]{10}$/i)
    //   // ])],
    //   email: [
    //     '',
    //     Validators.compose([
    //     Validators.required,
    //     Validators.email
    //     ])
    //   ],

    //   taiKhoan:[
    //     '' ,
    //     Validators.required
    //   ],

    // });

      // Display Customer List
      // for (let i = 0; i < 50; i++) {
      //   this.CustomerList.push({
      //     Code: this.CustomerList.customerCode,
      //     FirstName: this.CustomerList.firstName,
      //     LastName: this.CustomerList.lastName,
      //     Gender: this.CustomerList.gender,
      //     PhoneNumber: this.CustomerList.phone,
      //     Email: this.CustomerList.email,
      //     DateOfBirth: this.CustomerList.dateOfBirth,
      //     CustomerTypeID: this.CustomerList.customerTypeID,
      //   });
  }
}

// function uuidv4() {
//   throw new Error('Function not implemented.');
// }

