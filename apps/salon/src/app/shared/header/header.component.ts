import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSHeaderModule } from 'tds-ui/header';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSSelectModule } from 'tds-ui/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSInputModule } from 'tds-ui/tds-input';
import {  RouterModule } from '@angular/router';
import { TDSToolTipModule } from 'tds-ui/tooltip';
import { TDSModalModule } from 'tds-ui/modal';
import { AuthService } from '../../services/auth.service';
import { v4 as uuidv4 } from 'uuid';
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;

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
export class HeaderComponent implements OnInit {
  public contact = 1;
  public contactOptions=[ { id: 1, name: ' Elton John ' },
 { id: 2, name: 'Elvis Presley' },
 { id: 3, name: 'Paul McCartney' },
 { id: 4, name: 'Elton John' },
 { id: 5, name: 'Elvis Presley' },
 { id: 6, name: 'Paul McCartney' }]

isVisible = false;
signUpForm!: FormGroup;

showModal(): void {
  this.isVisible = true;
}

handleOk(): void {
  console.log('Button ok clicked!');
  this.isVisible = false;
}

handleCancel(): void {
  console.log('Button cancel clicked!');
  this.isVisible = false;
}
// register

    constructor(
        private fb: FormBuilder, private auth : AuthService,
    ) {
        //this.guId = Guid.create();

    }

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
        taiKhoan:['' , Validators.required],

        pass: [
            '',
            Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(PASSWORD_PATTERN)
            ])
        ],
        retype: [
            '',
            Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(PASSWORD_PATTERN)
            ])
        ],

        });
    }

    onSignUp(){
        const id = uuidv4();
        const name = this.signUpForm.value.taiKhoan;
        const email = this.signUpForm.value.email;
        const password = this.signUpForm.value.pass;
        const re_password = this.signUpForm.value.retype;
        this.auth.signUp(id,name,email,password,re_password).subscribe((result) =>{
            console.log(result);
            console.log(id,name,email,password,re_password);
            if(result.message != null){
                alert(result.message)
                if(result.flag == true){
                    this.signUpForm.reset();
                }
            }
        });
    }
}
