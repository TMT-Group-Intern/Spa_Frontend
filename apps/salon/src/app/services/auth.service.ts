import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = "https://localhost:44305/api/Account/"

  constructor(private http : HttpClient) {

  }

  // Show list of Customer


  // Create a new Customer
  CreateNewCustomer(CustomerID:bigint, FirstName:string, CustomerCode:string, LastName:string, Email:string, Phone:string, DateOfBirth:Date, Gender:string, CustomerTypeID:bigint){
    return this.http.post<{flag:boolean, message:string}>(this.baseUrl+'register', {
      CustomerID: CustomerID,
      FirstName: FirstName,
      CustomerCode: CustomerCode,
      LastName: LastName,
      Email: Email,
      Phone: Phone,
      DateOfBirth: DateOfBirth,
      Gender: Gender,
      CustomerTypeID: CustomerTypeID,
    })
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
