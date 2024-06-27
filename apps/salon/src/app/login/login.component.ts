import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { TDSCheckBoxModule } from 'tds-ui/tds-checkbox';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSInputModule } from 'tds-ui/tds-input';
import { AuthService } from '../shared.service';
import { Router } from '@angular/router';

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
  builder = inject(FormBuilder);
  httpService = inject(AuthService);

  constructor(
    private fb: FormBuilder, private auth : AuthService, private router:Router ) { }

  ngOnInit(){
    this.loginForm = this.fb.group({
      taiKhoan: ['' , Validators.required],
      matKhau: ['' , Validators.required],
    });
    const token = localStorage.getItem('userToken');
    if (token) {
          this.router.navigate(['home']);
        }
  }
  onLogin(){
    const email=this.loginForm.value.taiKhoan;
    const password = this.loginForm.value.matKhau;
    this.auth.login(email,password).subscribe((result:any) => {
      console.log(result.token, result.user);
      localStorage.setItem('userToken', result.token);
      if(result.token!= null && result.user!=null)
        {
          this.router.navigate(['home']);
        }
    });
  }
}
