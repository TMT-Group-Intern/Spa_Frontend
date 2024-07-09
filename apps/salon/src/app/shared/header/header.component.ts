//import { ModalRegisterComponent } from './../modal-register/modal-register.component';
import { Component, OnInit } from '@angular/core';
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
export class HeaderComponent  implements OnInit{
  public contact = 1;
  userSession:any;
  

  readonly contactOptions = [ { id: 1, name: ' Elton John ' },
    { id: 2, name: 'Elvis Presley' },
    { id: 3, name: 'Paul McCartney' },
    { id: 4, name: 'Elton John' },
    { id: 5, name: 'Elvis Presley' },
    { id: 6, name: 'Paul McCartney' }]

  signUpForm!: FormGroup;
  persondisplayWith!: FormControl;

  ngOnInit() {
  const storedUserSession = localStorage.getItem('userSession');
  if (storedUserSession !== null) {
    this.userSession = JSON.parse(storedUserSession);
  }
    }
    constructor(
        private fb: FormBuilder,
        private modalSvc:TDSModalService,
        private router:Router 
    ) {
    }
    onLogOut(){
      localStorage.removeItem('userSession');
      deleteCookie('userCookie')
      this.router.navigate(['']);
    };
}
function deleteCookie(cookieName:any) {
  document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}


