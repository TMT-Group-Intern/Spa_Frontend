import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { TDSCheckBoxModule } from 'tds-ui/tds-checkbox';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSInputModule } from 'tds-ui/tds-input';
import { AuthService } from '../services/auth.service';
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
  }

  // onLogin(){
  //   const email=this.loginForm.value.taiKhoan;
  //   const password = this.loginForm.value.matKhau;
  //   this.auth.login(email,password).subscribe((result) => {
  //     // if(result.token != null) {

  //     // }
  //     console.log(result);
  //   });
  // }

  onLogin(){
    const email=this.loginForm.value.taiKhoan;
    const password = this.loginForm.value.matKhau;
    this.auth.login(email,password).subscribe((result) => {
      console.log(result);
      if(result.token != null)
        {
          alert(result.token)
          this.router.navigate(['/home']);
        }
    });
  }

  // onLogin(): void {
  //   console.log(this.loginForm);
  //   this.auth.login(this.loginForm.value)
  //   .subscribe({
  //     next:(res)=>{
  //       alert(res.message)
  //     },
  //     error:(err)=>
  //       alert(err?.error.message)
  //   })
  // }

  // onLogin() {
  //   const email = this.loginForm.value.taiKhoan;
  //   const password = this.loginForm.value.matKhau;

  //   this.httpService.login2(email, password).subscribe(
  //     (result) => {
  //       console.log(result);
  //       // Handle successful login, e.g. save the token and navigate to dashboard
  //     },
  //     (error) => {
  //       console.error(error);
  //       // Handle login error, e.g. display error message
  //     }
  //   );
  // }
}
