import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { names } from 'tds-ui/tinycolor';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = "https://localhost:7192/api/"

  constructor(private http : HttpClient) {

  }

  // Render list of service
  RenderListService():Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl + 'Services');
  }

  //Create a new service
  CreateService(_serviceName:string, _price: number, _description:string){
    return this.http.post<{flag: boolean, message: string}>(this.baseUrl + 'Services',{
      serviceName: _serviceName,
      price: _price,
      description: _description
    })
  }

  // Show list of Customer
  CustomerList(): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'Customers');
  }

  // Create a new Customer
  CreateNewCustomer(val:any) {
    return this.http.post(this.baseUrl + 'Customers', val);
  }

  UpdateCustomer(val:any) {
    return this.http.put(this.baseUrl + 'Customers', val);
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
