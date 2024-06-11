/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-empty-function */
import { TDSMapperPipeModule } from 'tds-ui/cdk/pipes/mapper';
import { TDSDataTableModule } from 'tds-ui/data-table';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  TDSTableQueryParams } from 'tds-ui/table';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TDSColumnSettingsDTO, TDSColumnSettingsModule } from 'tds-ui/column-settings';
import { Observable, catchError, of } from 'rxjs';
import { TDSListModule } from 'tds-ui/list';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TDSAvatarModule } from 'tds-ui/avatar';
import { TDSModalModule } from 'tds-ui/modal';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSSelectModule } from 'tds-ui/select';

interface ItemData {
  id: number;
  name: string;
  age: number;
  address: string;
  createDate: Date;
  value: number;
  avatar: string;
}

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
  ],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit {

  isVisible = false;

  constructor(
    private fb: FormBuilder,
    private auth : AuthService,
    private router:Router,
) {
    //this.guId = Guid.create();
}

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log("Button ok clicked!");
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log("Button cancel clicked!");
    this.isVisible = false;
  }

  signUpForm!: FormGroup;

  public contactOptions = [
    { id: 1, name: 'Elton John' },
    { id: 2, name: 'Elvis Presley' },
    { id: 3, name: 'Paul McCartney' },
    { id: 4, name: 'Elton John' },
    { id: 5, name: 'Elvis Presley' },
    { id: 6, name: 'Paul McCartney' },
]

persondisplayWith!: FormControl;

  ngOnInit(): void {
      this.signUpForm = this.fb.group({
      // phoneNumber: ['', Validators.compose([
      //     Validators.required,
      //     Validators.pattern(/^[0-9]{10}$/i)
      // ])],
      email: [
          '',
          Validators.compose([
          Validators.required,
          Validators.email
          ])
      ],

      taiKhoan:[
        '' ,
        Validators.required
      ],

      });
  }

  listOfData: ItemData[] = [];

  //       ngOnInit(): void {
  //           const data = [];
  //           for (let i = 0; i < 50; i++) {
  //               data.push({
  //                   id: i,
  //                   name: `Edward King ${i}`,
  //                   age: 32,
  //                   address: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
  //                   sed do eiusmod tempor incididunt ut
  //                   labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
  //                   laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
  //                   voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
  //                   cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet,
  //                   consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
  //                   labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
  //                   laboris nisi ut aliquip ex ea commodo consequat. ${i}`,
  //                   createDate: new Date(),
  //                   value: Math.floor(Math.random() * 200000000),
  //                   avatar: `https://randomuser.me/api/portraits/women/${Math.floor(Math.random() * 100)}.jpg`,
  //               });
  //           }
  //           this.listOfData = data;
  // }
}
function uuidv4() {
  throw new Error('Function not implemented.');
}

