import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { TDSCheckBoxModule } from 'tds-ui/tds-checkbox';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSInputModule } from 'tds-ui/tds-input';
@Component({
  selector: 'frontend-login',
  standalone: true,
  imports: [CommonModule,
    TDSCheckBoxModule,
    TDSFormFieldModule,
    ReactiveFormsModule,
    TDSButtonModule, TDSInputModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      taiKhoan: ['' , Validators.required],
      matKhau: ['' , Validators.required],
    });
  }

  onSubmit(): void {
    console.log(this.loginForm);
  }
}
