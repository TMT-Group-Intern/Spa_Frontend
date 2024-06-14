import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = "https://localhost:44338/api/Account/"

  constructor(private http : HttpClient, private router: Router) {

   }

  signUp(id:string,name:string,email:string,password:string,re_password:string,role:string){
    return this.http.post<{flag:boolean, message:string}>(this.baseUrl+'register', {
      id: id,
      name: name,
      email:email,
      password: password,
      confirmPassword: re_password,
      role:role
    });
  }

  login(email:string,password:string){
    return this.http.post<{token:string}>(this.baseUrl+'login', {
      email: email,
      password: password
    });
  }
  logout() {
    // 1. Xóa tất cả token
    this.clearTokens();

    // 2. Chuyển hướng về login.component
    this.router.navigate(['login']);
    return alert('token')
  }

  private clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}
