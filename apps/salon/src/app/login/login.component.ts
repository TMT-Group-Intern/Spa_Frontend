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
  userSession:any;
  storedUserSession = localStorage.getItem('userSession');
  builder = inject(FormBuilder);
  httpService = inject(AuthService);
  

  constructor(
    private fb: FormBuilder, private auth : AuthService, private router:Router ) { }

    errorMessage= '';
  ngOnInit(){
    this.loginForm = this.fb.group({
      userName: ['' , Validators.required],
      password: ['' , Validators.required],
    });
    const cookie= getCookie('userToken')
        if (cookie) {
          if (this.storedUserSession !== null) {
            this.userSession = JSON.parse(this.storedUserSession);
            if(this.userSession.user.role==='Bác sĩ'){
              this.router.navigate(['doctor']);
            }
            else if(this.userSession.user.role==='Nhân viên kỹ thuật'){
              this.router.navigate(['technical-staff']);
            }
            else{
              this.router.navigate(['home']);
            }
          }
        }
  }
  
  onLogin(){
    const userName=this.loginForm.value.userName;
    const password = this.loginForm.value.password;
    this.auth.login(userName,password).subscribe((result:any) => {
      if(result.token!= null&&result.flag != false)
        {
          const userSession = {
            user: result.user,
          };
          const accessToken =result.token;
          const refreshToken =result.refreshToken;
          localStorage.setItem('userSession', JSON.stringify(userSession));
          localStorage.setItem('accessToken', JSON.stringify(accessToken));
          localStorage.setItem('refreshToken', JSON.stringify(refreshToken));
          setCookie('userToken', result.token, 7); // Lưu token vào cookie với hạn sử dụng 7 ngày
          if(userSession.user.role==='Bác sĩ'){
            this.router.navigate(['doctor']);
          }
          else if(userSession.user.role==='Nhân viên kỹ thuật'){
            this.router.navigate(['technical-staff']);
          }
          else{
            this.router.navigate(['home']);
          } 
        }
        else {
          this.errorMessage = result.mess;
        }
      },
      (error) => {
        this.errorMessage = 'Tài khoản hoặc mật khẩu không đúng!';
      }
    );
  }
}
  function setCookie(cookieName:any, cookieValue:any, expirationDays:any) {
  const date = new Date();
  date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}

function getCookie(cookieName:any) {
  const name = cookieName + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
