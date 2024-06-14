import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string| undefined;

  constructor(private http : HttpClient) {
     this.baseUrl = environment.BASE_URI

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

  // Update Customer
  UpdateCustomer(id: number, val:any) {
    return this.http.put(this.baseUrl + 'Customers/' + id, val);
  }

  //
  //Delete a customer
  deleteCustomer(id:any){
    return this.http.delete(this.baseUrl + 'Customers/'+ id);
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
