import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string | undefined = environment.BASE_URI;
  private hubConnection: signalR.HubConnection | undefined;
  private isConnected = false;

  constructor(private http: HttpClient) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:44305/chatHub')
      .build();
    this.hubConnection
      .start()
      .then(() => {
        //console.log('SignalR Connection started');
        this.isConnected = true;
      })
      .catch((err) => console.error('Error while starting connection: ' + err));
    this.hubConnection.onclose(() => {
      this.isConnected = false;
      //console.log('SignalR Connection closed');
    });
  }

  public addTransferChatDataListener(
    callback: (user: string, message: string) => void
  ): void {
    if (this.hubConnection) {
      this.hubConnection.on('ReceiveMessage', callback);
      //console.log(callback)
    }
  }

  public DataListenerDoctorChagneStatus(callback: () => void): void {
    //thay đổi trang thái nếu có thay đổi status từ bác sĩ
    if (this.hubConnection) {
      this.hubConnection.on('ChangeStatus', callback);
    }
  }

  public sendMessage(user: string, message: string): void {
    if (this.hubConnection) {
      this.hubConnection
        .invoke('SendMessage', user, message)
        .catch((err) => console.error(err));
    }
  }

  public getMessages(): void {
    if (this.hubConnection) {
      this.hubConnection
        .invoke('GetMessages')
        .then((messages: any[]) => {
          // Xử lý danh sách tin nhắn
          console.log(messages);
        })
        .catch((err) =>
          console.error('Error while retrieving messages: ' + err)
        );
    }
  }

  getChat(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'Chat/allMess');
  }
  // get by id service
  getByIdService(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'Services/' + id);
  }

  // Render list of service
  renderListService(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'Services');
  }

  // Search service
  searchService(searchTerm: string): Observable<any[]> {
    return this.http.get<any>(
      this.baseUrl + 'Services/searchService?searchTerm=' + searchTerm
    );
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
    return this.http.get<any>(this.baseUrl + 'User/allUser');
  }
  AdminList(): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'User/allAdmin');
  }
  EmpList(): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'User/allEmployee');
  }
  deleteUser(Email: string) {
    return this.http.delete(this.baseUrl + 'User/deleteUser?email=' + Email);
  }
  deleteAccount(UserName: string) {
    return this.http.delete(
      this.baseUrl + 'User/deleteAccount?userName=' + UserName
    );
  }
  changeStatusAccount(UserName: string) {
    return this.http.post(
      `${this.baseUrl}User/changeStatusAccount?userName=${UserName}`,
      {}
    );
  }
  createUser(val: any) {
    return this.http.post(this.baseUrl + 'Authentication/register', val);
  }
  createAccount(userName: string, password: string, confirmPassword: string) {
    return this.http.post<{ status: object }>(
      this.baseUrl + 'Authentication/createAccount',
      { userName, password, confirmPassword }
    );
  }
  createAccountForEmployee(Email: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email: Email };
    return this.http.post<{ status: object }>(
      this.baseUrl + 'Authentication/CreateUserForEmployee',
      body,
      { headers }
    );
  }
  editUser(email: string, val: any) {
    return this.http.put(this.baseUrl + 'User/updateUser?email=' + email, val);
  }
  editAccount(id: string, val: any) {
    return this.http.put(this.baseUrl + 'User/updateAccount?id=' + id, val);
  }
  getUserByUserName(userName: string): Observable<any[]> {
    return this.http.get<any>(
      this.baseUrl + 'User/getUserByUserName?userName=' + userName
    );
  }
  getUserByUserID(id: string): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'User/getUserByUserID?id=' + id);
  }
  getAdminByEmail(email: string): Observable<any[]> {
    return this.http.get<any>(
      this.baseUrl + 'User/getUserByAdmin?email=' + email
    );
  }
  getEmployeeByEmail(email: string): Observable<any[]> {
    return this.http.get<any>(
      this.baseUrl + 'User/getUserByEmployee?email=' + email
    );
  }
  getBranchName(branchID: number): Observable<any[]> {
    return this.http.get<any>(
      this.baseUrl + 'Branch/getBranchNameByID?id=' + branchID
    );
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
    return this.http.get<any>(
      this.baseUrl + 'Payment/GetPaymentsByBill?idBill=' + id
    );
  }

  // Search Customer
  searchCustomer(val: any): Observable<{ customers: any[] }> {
    return this.http.get<any>(
      this.baseUrl + 'Customers/search?searchTerm=' + val
    );
  }

  searchUser(val: any): Observable<{ users: any[] }> {
    return this.http.get<any>(
      this.baseUrl + 'Users/searchUser?searchTerm=' + val
    );
  }

  searchAccount(val: any): Observable<{ accounts: any[] }> {
    return this.http.get<any>(
      this.baseUrl + 'Users/searchAccount?searchTerm=' + val
    );
  }

  searchEmployee(val: any): Observable<{ employees: any[] }> {
    return this.http.get<any>(
      this.baseUrl + 'Users/searchEmployee?searchTerm=' + val
    );
  }

  // Create a new Customer
  CreateNewCustomer(val: any) {
    return this.http.post(this.baseUrl + 'Customers', val);
  }

  UploadImageCustomer(id: number, formData: FormData) {
    return this.http.post(
      `${this.baseUrl}Customers/uploadMutil?id=` + id,
      formData
    );
  }

  // Update Customer
  UpdateCustomer(id: number, val: any) {
    return this.http.put(this.baseUrl + 'Customers/' + id, val);
  }

  //page of customers
  pageCustomers(pageNumber: number, pageSize: number) {
    return this.http.get(
      this.baseUrl +
      'Customers/Page?pageNumber=' +
      pageNumber +
      '&pageSize=' +
      pageSize
    );
  }

  pageUsers(pageNumber: number, pageSize: number) {
    return this.http.get(
      this.baseUrl +
      'User/AllUserPage?pageNumber=' +
      pageNumber +
      '&pageSize=' +
      pageSize
    );
  }

  pageAdminByPages(pageNumber: number, pageSize: number) {
    return this.http.get(
      this.baseUrl +
      'User/AllAdminPage?pageNumber=' +
      pageNumber +
      '&pageSize=' +
      pageSize
    );
  }

  pageAccountByPages(pageNumber: number, pageSize: number) {
    return this.http.get(
      this.baseUrl +
      'User/AllAccountPage?pageNumber=' +
      pageNumber +
      '&pageSize=' +
      pageSize
    );
  }

  pageActiveAccountByPages(pageNumber: number, pageSize: number) {
    return this.http.get(
      this.baseUrl +
      'User/AllAccountActivePage?pageNumber=' +
      pageNumber +
      '&pageSize=' +
      pageSize
    );
  }

  pageNotActiveAccountByPages(pageNumber: number, pageSize: number) {
    return this.http.get(
      this.baseUrl +
      'User/AllAccountNotActivePage?pageNumber=' +
      pageNumber +
      '&pageSize=' +
      pageSize
    );
  }

  pageEmpByPages(jobtypeID: number, pageNumber: number, pageSize: number) {
    return this.http.get(
      this.baseUrl +
      'User/AllEmpPage?jobTypeId=' +
      jobtypeID +
      '&pageNumber=' +
      pageNumber +
      '&pageSize=' +
      pageSize
    );
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
    return this.http.put(
      this.baseUrl + 'Appointment/updatestatus/' + id + '?status=' + status,
      status
    );
  }

  //
  updateAppointmentWithService(id: number, body: any) {
    return this.http.put(this.baseUrl + 'Appointment/Test/' + id, body);
  }

  // Get Appointment by ID
  getAppointment(id: number): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'Appointment/' + id);
  }

  // lấy danh sách lịch hẹn theo thời gian
  searchAppointmentByDays(
    fromDay: string,
    toDay: string,
    branchId: number,
    search: string,
    limit: number,
    offset: number,
    status: string
  ) {
    return this.http.get<any>(
      this.baseUrl +
      'Appointment/searchAppointment?fromDate=' +
      fromDay +
      '&toDate=' +
      toDay +
      '&branchID=' +
      branchId +
      '&searchItem=' +
      search +
      '&limit=' +
      limit +
      '&offset=' +
      offset +
      '&status=' +
      status
    );
  }
  // lấy danh sách lịch hẹn theo thời gian
  getAppointmentByDays(
    branchId: number,
    fromDay: string,
    toDay: string,
    pageNumber: number,
    pageSize: number
  ) {
    return this.http.get<any>(
      this.baseUrl +
      'Appointment/getbyday?branchID=' +
      branchId +
      '&fromDate=' +
      fromDay +
      '&toDate=' +
      toDay +
      '&pageNumber=' +
      pageNumber +
      '&pageSize=' +
      pageSize
    );
  }
  // lấy danh sách lịch hẹn theo thời gian với trạng thái lịch hẹn
  getAppointmentByDaysWithStatus(
    branchId: number,
    fromDay: string,
    toDay: string,
    pageNumber: number,
    pageSize: number,
    status: string
  ) {
    return this.http.get<any>(
      this.baseUrl +
      'Appointment/GetByStatusWithPaging?branchID=' +
      branchId +
      '&fromDate=' +
      fromDay +
      '&toDate=' +
      toDay +
      '&pageNumber=' +
      pageNumber +
      '&pageSize=' +
      pageSize +
      '&status=' +
      status
    );
  }
  //
  signUp(
    lastName: string,
    firstName: string,
    gender: string,
    phone: string,
    email: string,
    password: string,
    confirmPassword: string,
    dateOfBirth: string,
    hireDate: string,
    jobTypeID: number,
    branchID: number,
    role: string
  ) {
    return this.http.post<{ status: object }>(
      this.baseUrl + 'Authentication/register',
      {
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
        role: role,
      }
    );
  }

  changePassword(
    userName: string,
    oldPassword: string,
    password: string,
    confirmPassword: string
  ) {
    return this.http.post<{ flag: boolean; message: string }>(
      this.baseUrl + 'Authentication/changePassword',
      {
        userName: userName,
        oldPassword: oldPassword,
        password: password,
        confirmPassword: confirmPassword,
      }
    );
  }

  createAdmin(
    lastName: string,
    firstName: string,
    gender: string,
    phone: string,
    email: string,
    userName: string,
    password: string,
    confirmPassword: string,
    dateOfBirth: string
  ) {
    return this.http.post<{ status: object }>(
      this.baseUrl + 'Authentication/createAdmin',
      {
        lastName: lastName,
        firstName: firstName,
        phone: phone,
        email: email,
        userName: userName,
        password: password,
        confirmPassword: confirmPassword,
        dateOfBirth: dateOfBirth,
        gender: gender,
      }
    );
  }

  // Update Discount
  updateDiscount(id: any, discount: any, val: any) {
    return this.http.put(
      this.baseUrl +
      'Appointment/UpdateDiscount?id=' +
      id +
      '&perDiscount=' +
      discount,
      val
    );
  }
  // get Customer for technical staff
  getCustomerInQueueForTechnicalStaff(
    branchID: number,
    status: string
  ): Observable<any[]> {
    return this.http.get<any[]>(
      'https://localhost:44305/GetAppointmentByStatus?idBrand=' +
      branchID +
      '&status=' +
      status
    );
  }

  // Assign Spa Therapist
  assignSpaTherapist(appointment: any, empID: any, val: any) {
    return this.http.put(
      this.baseUrl +
      'Appointment/assigntechnicalstaff?idApp=' +
      appointment +
      '&idEmploy=' +
      empID,
      val
    );
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
    return this.http.get<any>(
      this.baseUrl +
      'User/EmployeeByBranchAndJob?branchID=' +
      branch +
      '&jobTypeID=' +
      job
    );
  }
  getAllEmployee(): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'User/allEmployee');
  }
  // Get User by Email
  getUser(email: string): Observable<any[]> {
    return this.http.get<any>(
      this.baseUrl + 'User/getUserByEmail?email=' + email
    );
  }

  checkExistUser(email: string) {
    return this.http.get<{ check: object }>(
      this.baseUrl + 'User/getUserBoolByEmail?email=' + email
    );
  }

  // Get Branch
  getBranch(): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'Branch/allBranches');
  }

  // Get Job Type
  getJobType(): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'Job/allJobs');
  }

  getJobTypeForPermission(): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'Job/allJobForPermissions');
  }

  getAllPermissions(): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'Permission/allPermissons');
  }

  getRolePermissions(id: number): Observable<any[]> {
    return this.http.get<any>(
      this.baseUrl + 'Permission/GetPermissionsByJobType?jobTypeId=' + id
    );
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
    return this.http.get<any>(
      this.baseUrl + 'Bill/getbillbycustomer?cusId=' + id
    );
  }

  // Update Bill
  updateBill(id: any, val: any) {
    return this.http.put(this.baseUrl + 'Bill/' + id, val);
  }

  //
  getAllBillByAppointmentID(id: number): Observable<any> {
    return this.http.get<any>(
      this.baseUrl + 'Bill/GetBillByAppointmentID?appId=' + id
    );
  }

  //
  login(userName: string, password: string) {
    return this.http.post<{
      flag: boolean;
      mess: string;
      userSession: object;
      token: string;
    }>(this.baseUrl + 'Authentication/login', {
      userName: userName,
      password: password,
    });
  }

  // báo cáo theo ngày
  getByDays(branchId: number, fromDay: string, toDay: string) {
    return this.http.get(
      this.baseUrl +
      'Report/getbyday?idBrand=' +
      branchId +
      '&fromDate=' +
      fromDay +
      '&toDate=' +
      toDay
    );
  }

  // danh sách các thanh toán trong ngày
  getDetails(branchId: number, fromDay: string, toDay: string) {
    return this.http.get(
      this.baseUrl +
      'Report/getdetail?idBrand=' +
      branchId +
      '&fromDate=' +
      fromDay +
      '&toDate=' +
      toDay
    );
  }

  // lấy danh sách lịch sử của người dùng
  getBillHistory(customerId: number) {
    return this.http.get(
      this.baseUrl + 'Bill/getbillhistory?customerId=' + customerId
    );
  }

  getPaymentsByBill(billID: number) {
    return this.http.get(
      this.baseUrl + 'Payment/GetPaymentsByBill?idBill=' + billID
    );
  }

  // treatment Post
  addTreatmentPlan(body: any) {
    return this.http.post(this.baseUrl + 'Treatment', body);
  }

  //
  getTreatmentOfCustomer(idCus: number): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'Treatment?customerId=' + idCus);
  }

  //
  getTreatmentDetail(idTreatment: number): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'Treatment/' + idTreatment);
  }

  //Cập nhật treatment
  updateTreatmentPlan(treatmentId: number, body: any) {
    return this.http.put(this.baseUrl + 'Treatment/' + treatmentId, body);
  }

  getFinance() {
    return this.http.get(this.baseUrl + "Report/finance")
  }

  getAllThuChi() {
    return this.http.get(this.baseUrl + "Report/PhieuThuChi")
    //Xóa treatment detail
  }

  deleteTreatmentDetail(treatmentDetailId: number) {
    return this.http.delete(
      this.baseUrl + 'Treatment?treatmentDetailID=' + treatmentDetailId
    );
  }

  //Cập nhật status
  updateStatusTreatment(idTreatment: number, status: string) {
    return this.http.put(
      this.baseUrl +
      'Treatment/UpdateStatusTreatmentCard?treatmentCardId=' +
      idTreatment +
      '&status=' +
      status,
      status
    );
  }

  taoPhieuThuChi(val: any) {
    return this.http.post(this.baseUrl + 'IncomeExpenses', val)
  }
}
