import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSCheckBoxModule } from 'tds-ui/tds-checkbox';
import { RouterModule } from '@angular/router';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSInputModule } from 'tds-ui/tds-input';
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;

@Component({
  selector: 'frontend-register',
  standalone: true,
  imports: [CommonModule,TDSFormFieldModule,ReactiveFormsModule,TDSCheckBoxModule,RouterModule,TDSButtonModule,TDSInputModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  signUpForm!: FormGroup;
    constructor(
        private fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.signUpForm = this.fb.group({
        phoneNumber: ['', Validators.compose([
            Validators.required,
            Validators.pattern(/^[0-9]{10}$/i)
        ])],
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

    onSubmit(): void {
        console.log(this.signUpForm);
    }
}
