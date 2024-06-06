import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = "https://localhost:7049/api/Account/"
  constructor(private http : HttpClient) { }

  signUp(userOjb:any){
    return this.http.post<any>(`${this.baseUrl}register`, userOjb)
  }

  login(email:string,password:string){
    return this.http.post<{token:string}>(this.baseUrl+'login', {
      email: email,
      password: password
    })
  }
}
