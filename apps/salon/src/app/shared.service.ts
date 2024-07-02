import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpHeaders } from '@angular/common/http';
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
    return this.http.post(this.baseUrl + 'Services', val);
  }

  //Edit a service
  editService(id: number,val:any){
    return this.http.put(this.baseUrl + 'Services/'+ id, val);
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

  // Search Customer
  searchCustomer(val: any): Observable<{customers: any[]}> {
    return this.http.get<any>(this.baseUrl + 'Customers/search?searchTerm=' + val);
  }

  // Create a new Customer
  CreateNewCustomer(val:any) {
    return this.http.post(this.baseUrl + 'Customers', val);
  }

  // Update Customer
  UpdateCustomer(id: number, val:any) {
    return this.http.put(this.baseUrl + 'Customers/' + id, val);
  }

  //page of customers
  pageCustomers(pageNumber: number, pageSize: number) {
    return this.http.get(this.baseUrl + 'Customers/Page?pageNumber='+pageNumber+'&pageSize='+pageSize);
  }

  //Delete a customer
  deleteCustomer(id:any){
    return this.http.delete(this.baseUrl + 'Customers/'+ id);
  }

  //get history of customers
  getHistoryCustomer(id: number){
    return this.http.get('https://localhost:44305/GetHistory?cutomerId='+ id);
  }

  // Show list of Appointment through Branch ID
  appointmentList(id: number): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'Appointment?idBrand=' + id);
  }

  // Create a new Appointment
  createAppointment(val:any) {
    return this.http.post(this.baseUrl + 'Appointment', val);
  }

  // Update Appointment
  UpdateAppointment(id: number, val:any) {
    return this.http.put(this.baseUrl + 'Appointment/' + id, val);
  }

  // Update Status
  UpdateStatus(id: any, status: any) {
    return this.http.put(this.baseUrl + 'Appointment/updatestatus/' + id + '?status=' + status, status);
  }

  //
  updateAppointmentWithService(id: number, status: any, val:any) {
    return this.http.put(this.baseUrl + 'Appointment/api/UpdateAppointmentWithService/' + id + '/' + status, val);
  }

  // Get Appointment by ID
  getAppointment(id: number): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'Appointment/' + id);
  }

  // Update Discount
  updateDiscount(id: any, discount: any, val:any) {
    return this.http.put(this.baseUrl + 'Appointment/UpdateDiscount?id=' + id + '&perDiscount=' + discount, val);
  }

  // Assign Spa Therapist
  assignSpaTherapist(appointment: any, empID: any, val:any) {
    return this.http.put(this.baseUrl + 'Appointment/assigntechnicalstaff?idApp=' + appointment + '&idEmploy=' + empID, val);
  }

  // Create a Payment
  createPayment(id: any, val: any) {
    return this.http.post(this.baseUrl + 'Payment?Id=' + id, val);
  }


  //
  employeeList(): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'User/allEmployee');
  }

  // Get Employee by Branch ID & Job Type
  getEmployee(branch: number, job: number): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'User/EmployeeByBranchAndJob?branchID=' + branch + '&jobTypeID=' + job);
  }

  //
  signUp(id:string,name:string,email:string,password:string,re_password:string){
    return this.http.post<{flag:boolean, message:string}>(this.baseUrl+'register', {
      id: id,
      name: name,
      email:email,
      password: password,
      confirmPassword: re_password
    })
  }

  //
  login(email:string,password:string){
    return this.http.post<{user:object,token:object}>(this.baseUrl+'Authentication/login', {
      email: email,
      password: password
    })
  }
  // login(email:string,password:string): Observable<any[]> {
  //   return this.http.post<any>(this.baseUrl+'Authentication/login', {
  //     email: email,
  //     password: password
  //   })
  // }

}
