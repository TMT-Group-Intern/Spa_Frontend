import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSCheckBoxModule } from 'tds-ui/tds-checkbox';
import { Router, RouterModule } from '@angular/router';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSInputModule } from 'tds-ui/tds-input';
import { AuthService } from '../services/auth.service';
//import { Guid } from 'guid-typescript';
import { v4 as uuidv4 } from 'uuid';
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;

@Component({
  selector: 'frontend-register',
  standalone: true,
  imports: [CommonModule,TDSFormFieldModule,ReactiveFormsModule,TDSCheckBoxModule,RouterModule,TDSButtonModule,TDSInputModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
    //private guId: Guid;
  signUpForm!: FormGroup;
    constructor(
        private fb: FormBuilder, private auth : AuthService, private router:Router,
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
