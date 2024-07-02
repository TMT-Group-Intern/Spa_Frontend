//import { ModalRegisterComponent } from './../modal-register/modal-register.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSHeaderModule } from 'tds-ui/header';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSSelectModule } from 'tds-ui/select';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSInputModule } from 'tds-ui/tds-input';
import {  Router, RouterModule } from '@angular/router';
import { TDSToolTipModule } from 'tds-ui/tooltip';
import {  TDSModalModule, TDSModalService } from 'tds-ui/modal';
import { AuthService } from '../../shared.service';

@Component({
  selector: 'frontend-header',
  standalone: true,
  imports: [CommonModule ,
    ReactiveFormsModule,
    TDSHeaderModule,
    TDSFormFieldModule,
    TDSSelectModule,
    FormsModule,
    TDSButtonModule,
    TDSInputModule,
    RouterModule,
    TDSToolTipModule,
    TDSModalModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  {
  public contact = 1;

  readonly contactOptions = [ { id: 1, name: ' Elton John ' },
    { id: 2, name: 'Elvis Presley' },
    { id: 3, name: 'Paul McCartney' },
    { id: 4, name: 'Elton John' },
    { id: 5, name: 'Elvis Presley' },
    { id: 6, name: 'Paul McCartney' }]

signUpForm!: FormGroup;
persondisplayWith!: FormControl;

    constructor(
        private fb: FormBuilder,
        private modalSvc:TDSModalService,
        private router:Router 
    ) {
    }
    onLogOut(){
      //const token = localStorage.getItem('userToken')
      localStorage.removeItem('userToken');
      this.router.navigate(['']);
    };
}


