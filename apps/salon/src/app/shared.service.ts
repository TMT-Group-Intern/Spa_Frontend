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

  // get by id service
  getByIdService(id:number): Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl + 'Services/'+ id);
  }

  // Render list of service
  renderListService():Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl + 'Services');
  }

  //Create a new service
  createService(val:any){
    return this.http.post(this.baseUrl + 'Services',val);
  }

  //Edit a service
  editService(id: number,val:any){
    return this.http.put(this.baseUrl + 'Services/'+ id,val);
  }

  //Delete a service
  deleteAService(id:any){
    return this.http.delete(this.baseUrl + 'Services/'+ id);
  }

  // Show list of Customer
  CustomerList(): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'Customers');
  }

  // Get Customer by ID
  getCustomer(id: number): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'Customers/' + id);
  }

  // Create a new Customer
  CreateNewCustomer(val:any) {
    return this.http.post(this.baseUrl + 'Customers', val);
  }

  UpdateCustomer(id: number, val:any) {
    return this.http.put(this.baseUrl + 'Customers/' + id, val);
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
