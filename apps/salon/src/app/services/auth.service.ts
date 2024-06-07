import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = "https://localhost:44338/api/Account/"

  constructor(private http : HttpClient) {

   }

  signUp(id:string,name:string,email:string,password:string,re_password:string){
    return this.http.post<{flag:boolean, message:string}>(this.baseUrl+'register', {
      id: id,
      name: name,
      email:email,
      password: password,
      confirmPassword: re_password
    })
  }

  login(email:string,password:string){
    return this.http.post<{token:string}>(this.baseUrl+'login', {
      email: email,
      password: password
    })
  }
}
