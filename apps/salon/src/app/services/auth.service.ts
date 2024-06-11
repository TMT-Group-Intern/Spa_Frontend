import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = "https://localhost:7192/api/"

  constructor(private http : HttpClient) {

  }

  // Show list of Customer
  CustomerList(): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'Customers');
  }

  // Create a new Customer
  // CreateNewCustomer(FirstName:string, LastName:string, Email:string, Phone:string, DateOfBirth:Date, Gender:string){
  //   return this.http.post<{flag:boolean, message:string}>(this.baseUrl+'Customers', {
  //     FirstName: FirstName,
  //     LastName: LastName,
  //     Email: Email,
  //     Phone: Phone,
  //     DateOfBirth: DateOfBirth,
  //     Gender: Gender,
  //   })
  // }

  // Create a new Customer
  CreateNewCustomer(val:any) {
    return this.http.post(this.baseUrl + 'Customers', val);
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
