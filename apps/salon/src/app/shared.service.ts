import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string | undefined;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.BASE_URI

  }

  // get by id service
  getByIdService(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'Services/' + id);
  }

  // Render list of service
  renderListService(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'Services');
  }

  //Create a new service
  createService(val: any) {
    return this.http.post(this.baseUrl + 'Services', val);
  }

  //Edit a service
  editService(id: number, val: any) {
    return this.http.put(this.baseUrl + 'Services/' + id, val);
  }

  //Delete a service
  deleteAService(id: any) {
    return this.http.delete(this.baseUrl + 'Services/' + id);
  }
  UserList(): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'User/allUser2')
  }
  AdminList(): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'User/allAdmin')
  }
  EmpList(): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'User/allEmployee')
  }
  deleteUser(Email: string) {
    return this.http.delete(this.baseUrl + 'User/deleteUser?email=' + Email);
  }
  createUser(val: any) {
    return this.http.post(this.baseUrl + 'Authentication/register', val);
  }
  createAccountForEmployee(Email: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email: Email };
    return this.http.post<{ mess: object }>(this.baseUrl + 'Authentication/CreateUserForEmployee', body, { headers });
  }
  editUser(email: string, val: any) {
    return this.http.put(this.baseUrl + 'User/updateUser' + email, val);
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
  searchCustomer(val: any): Observable<{ customers: any[] }> {
    return this.http.get<any>(this.baseUrl + 'Customers/search?searchTerm=' + val);
  }

  // Create a new Customer
  CreateNewCustomer(val: any) {
    return this.http.post(this.baseUrl + 'Customers', val);
  }

  UploadImageCustomer(id: number, formData: FormData) {
    return this.http.post(`${this.baseUrl}Customers/uploadMutil?id=` + id, formData);
  }


  // Update Customer
  UpdateCustomer(id: number, val: any) {
    return this.http.put(this.baseUrl + 'Customers/' + id, val);
  }

  //page of customers
  pageCustomers(pageNumber: number, pageSize: number) {
    return this.http.get(this.baseUrl + 'Customers/Page?pageNumber=' + pageNumber + '&pageSize=' + pageSize);
  }

  //Delete a customer
  deleteCustomer(id: any) {
    return this.http.delete(this.baseUrl + 'Customers/' + id);
  }

  //get history of customers
  getHistoryCustomer(id: number) {
    return this.http.get('https://localhost:44305/GetHistory?cutomerId=' + id);
  }

  // Show list of Appointment through Branch ID
  appointmentList(id: number): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'Appointment?idBrand=' + id);
  }

  // Create a new Appointment
  createAppointment(val: any) {
    return this.http.post(this.baseUrl + 'Appointment', val);
  }

  // Update Appointment
  UpdateAppointment(id: number, val: any) {
    return this.http.put(this.baseUrl + 'Appointment/' + id, val);
  }

  // Update Status
  UpdateStatus(id: any, status: any) {
    return this.http.put(this.baseUrl + 'Appointment/updatestatus/' + id + '?status=' + status, status);
  }

  //
  updateAppointmentWithService(id: number, status: any, val: any) {
    return this.http.put(this.baseUrl + 'Appointment/api/UpdateAppointmentWithService/' + id + '/' + status, val);
  }

  // Get Appointment by ID
  getAppointment(id: number): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'Appointment/' + id);
  }

  //
  signUp(lastName: string, firstName: string, gender: string, phone: string, email: string, password: string, confirmPassword: string, dateOfBirth: string, hireDate: string, jobTypeID: string, branchID: string, role: string) {
    return this.http.post<{ status: object }>(this.baseUrl + 'Authentication/register', {
      lastName: lastName,
      firstName: firstName,
      phone: phone,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
      dateOfBirth: dateOfBirth,
      hireDate: hireDate,
      gender: gender,
      jobTypeID: jobTypeID,
      branchID: branchID,
      role: role
    })
  }

  // Update Discount
  updateDiscount(id: any, discount: any, val: any) {
    return this.http.put(this.baseUrl + 'Appointment/UpdateDiscount?id=' + id + '&perDiscount=' + discount, val);
  }
  // get Customer for technical staff
  getCustomerInQueueForTechnicalStaff(branchID: number, status: string): Observable<any[]> {
    return this.http.get<any[]>('https://localhost:44305/GetAppointmentByStatus?idBrand=' + branchID + '&status=' + status);
  }
  getAppointmentById(id: number) {
    return this.http.get(this.baseUrl + 'Appointment/' + id);
  }

  // Assign Spa Therapist
  assignSpaTherapist(appointment: any, empID: any, val: any) {
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
  login(email: string, password: string) {
    return this.http.post<{ flag: boolean, mess: string, token: string }>(this.baseUrl + 'Authentication/login', {
      email: email,
      password: password
    })
  }

}
