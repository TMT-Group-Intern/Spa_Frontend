import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpHeaders } from '@angular/common/http';
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
    return this.http.get<any>(this.baseUrl + 'User/allUser')
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
    return this.http.post<{ status: object }>(this.baseUrl + 'Authentication/CreateUserForEmployee', body, { headers });
  }
  editUser(email: string, val: any) {
    return this.http.put(this.baseUrl + 'User/updateUser?email='+email, val);
  }
  getAdminByEmail(email: string): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'User/getUserByAdmin?email=' + email)
  }
  getEmployeeByEmail(email: string): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'User/getUserByEmployee?email=' + email)
  }
  getBranchName(branchID: number): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'Branch/getBranchNameByID?id=' + branchID)
  }
  // Show list of Customer
  CustomerList(): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'Customers');
  }

  // Get Customer by ID
  getCustomer(id: any): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'Customers/' + id);
  }

  getPaymentHistory(id: any): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'Payment/GetPaymentsByBill?idBill=' + id);
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
  updateAppointmentWithService(id: number, body:any) {
    return this.http.put(this.baseUrl + 'Appointment/Test/' + id, body);
  }

  // Get Appointment by ID
  getAppointment(id: number): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'Appointment/' + id);
  }
  // lấy danh sách lịch hẹn theo thời gian
  getAppointmentByDays(branchId: number, fromDay: string, toDay: string) {
    return this.http.get<any>(this.baseUrl + 'Appointment/getbyday?branchID='+ branchId + '&fromDate='+ fromDay +'&toDate='+ toDay);
  }

  //
  signUp(lastName: string, firstName: string, gender: string, phone: string, email: string, password: string, confirmPassword: string, dateOfBirth: string, hireDate: string, jobTypeID: number, branchID: number, role: string) {
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

  // Assign Spa Therapist
  assignSpaTherapist(appointment: any, empID: any, val: any) {
    return this.http.put(this.baseUrl + 'Appointment/assigntechnicalstaff?idApp=' + appointment + '&idEmploy=' + empID, val);
  }

  // Create a Payment
  createPayment(val: any) {
    return this.http.post(this.baseUrl + 'Payment', val);
  }

  //
  employeeList(): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'User/allEmployee');
  }

  // Get Employee by Branch ID & Job Type
  getEmployee(branch: number, job: number): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'User/EmployeeByBranchAndJob?branchID=' + branch + '&jobTypeID=' + job);
  }

  // Get User by Email
  getUser(email: string): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'User/getUserByEmail?email=' + email);
  }

  checkExistUser(email: string) {
    return this.http.get<{ check: object }>(this.baseUrl + 'User/getUserBoolByEmail?email=' + email);
  }

  // Get Branch
  getBranch(): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'Branch/allBranches');
  }

  // Get Job Type
  getJobType(): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'Job/allJobs');
  }

  // Create Bill
  createBill(val: any) {
    return this.http.post(this.baseUrl + 'Bill', val);
  }

  //
  getBill(id: number): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'Bill/' + id);
  }

  //
  getAllBillOfCus(id: number): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'Bill/getbillbycustomer?cusId=' + id);
  }

  // Update Bill
  updateBill(id: any, val: any) {
    return this.http.put(this.baseUrl + 'Bill/' + id, val);
  }

  //
  getAllBillByAppointmentID(id: number): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'Bill/GetBillByAppointmentID?appId='+id);
  }

  //
  login(email: string, password: string) {
    return this.http.post<{ flag: boolean, mess: string,userSession:object, token: string }>(this.baseUrl + 'Authentication/login', {
      email: email,
      password: password
    })
  }

  // báo cáo theo ngày
  getByDays(branchId: number, fromDay: string, toDay: string){
    return this.http.get(this.baseUrl + 'Report/getbyday?idBrand=' + branchId + '&fromDate=' + fromDay + '&toDate=' + toDay);
  }
  // danh sách các thanh toán trong ngày
  getDetails(branchId: number, fromDay: string, toDay: string){
    return this.http.get(this.baseUrl + 'Report/getdetail?idBrand=' + branchId + '&fromDate=' + fromDay + '&toDate=' + toDay);
  }
  // lấy danh sách lịch sử của người dùng
  getBillHistory(customerId:number){
    return this.http.get(this.baseUrl + 'Bill/getbillhistory?customerId=' + customerId);
  }
}
