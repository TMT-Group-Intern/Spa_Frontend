import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSListModule } from 'tds-ui/list';
import { TDSDataTableModule } from 'tds-ui/data-table';
import { TDSColumnSettingsModule } from 'tds-ui/column-settings';
import { UsersModalComponent } from '../users/users-modal/users-modal.component';
import { TDSTimelineModule } from 'tds-ui/timeline';
import { TDSToolTipModule } from 'tds-ui/tooltip';
import { TDSModalService } from 'tds-ui/modal';
import { AuthService } from '../../shared.service';
import { BehaviorSubject, concatMap, debounceTime, filter, forkJoin, of, switchMap, tap } from 'rxjs';
import { TDSButtonModule } from 'tds-ui/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSSelectModule } from 'tds-ui/select';
import { TDSCascaderModule, TDSCascaderOption } from 'tds-ui/cascader';
import * as moment from 'moment';
import { TDSPaginationModule } from 'tds-ui/pagination';

const roleOptions = [
  {
    value: 'All',
    label: 'Tất cả',
    isLeaf: true
},
  {
      value: '5',
      label: 'Quản lý',
      isLeaf: true
  },
  {
      value: '2',
      label: 'Bác sĩ',
      isLeaf: true
  }
  ,
  {
      value: '1',
      label: 'Tiếp tân',
      isLeaf: true
  }
  ,
  {
      value: '3',
      label: 'Nhân viên kỹ thuật',
      isLeaf: true
  },
  {
      value: '4',
      label: 'Bảo vệ',
      isLeaf: true
  }
];
@Component({
  selector: 'frontend-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
    imports: [
    CommonModule,
    TDSListModule,
    TDSDataTableModule,
    TDSColumnSettingsModule,
    UsersModalComponent,
    TDSTimelineModule,
    TDSToolTipModule,
    TDSButtonModule,
    ReactiveFormsModule,
    TDSFormFieldModule,
    TDSSelectModule,
    FormsModule,
    TDSCascaderModule,
    TDSPaginationModule,
  ],
})
export class UsersComponent implements OnInit{
  tdsOptions: TDSCascaderOption[] = roleOptions;
  values: string[] = ['All'];
  _change$ = new BehaviorSubject<string>('');
  private readonly tModalSvc =inject(TDSModalService)
  UserList:any;
  selectedUserType = this.values.toString();
  userSession:any;
  pageNumber: any = 1
  pageSize: any = 10
  totalItemsUsers: any
  searchText='';
  filteredUsers: any;

  constructor(
    private auth : AuthService,
  ) {}
  onChanges(values: string[]): void {
    this.selectedUserType=this.values.toString()
    this.initUserList();
}
  ngOnInit(): void {  
    const storedUserSession = localStorage.getItem('userSession');
    if (storedUserSession !== null) {
      this.userSession = JSON.parse(storedUserSession);
    }
    this.initUserList();
    this._change$.pipe(
      debounceTime(100),
      switchMap((search: string) => {
        return search ? this.auth.searchUser(search) : of(null)
      })
    ).subscribe((data) => {
      if (data?.users !== undefined){
        this.UserList = data.users;
      }else{
        this.UserList = this.filteredUsers
      }
    })
  }

  initUserList() {
    this.auth.pageUsers(this.pageNumber, this.pageSize).subscribe((data:any) => {
      this.UserList = data.item;
      this.totalItemsUsers = data.totalItems;
      if(this.selectedUserType==='All'){
        this.UserList;
        this.filteredUsers = this.UserList;
      }
      else if (this.selectedUserType === '5') {
        this.auth.pageAdminByPages(this.pageNumber, this.pageSize)
        .subscribe((data:any) => {
          this.UserList = data.item;
          this.totalItemsUsers = data.totalItems;
          this.filteredUsers = this.UserList;})   
      }
      else{       
        this.auth.pageEmpByPages(parseInt(this.selectedUserType),this.pageNumber, this.pageSize)
        .subscribe((data:any) => {
          this.UserList = data.item;
          this.totalItemsUsers = data.totalItems;
          this.filteredUsers = this.UserList;})     
      }
    });
  }
  // Format Date & Time
  formatDate(date: string, format: string): string {
    return moment(date).format(format);
  }

    /*get back pageNumber*/
    changeNumberPage(event: number): void {
      this.pageNumber = event;
      this.initUserList();
    }
    // get back changeSizePage
    changeSizePage(event: number): void {
      this.pageSize = event;
      this.initUserList();
    }
  
    onRefresh(event: MouseEvent): void {
      this.pageNumber = 1;
      this.initUserList();
    }
  createUser(){
    const modal = this.tModalSvc.create({
      title:'Thêm nhân viên',
      content: UsersModalComponent,
      footer:null,
      size:'xl'
    });
    modal.afterClose.asObservable().pipe(tap(()=>  this.initUserList())).subscribe
    ();
  }
  createAccountForEmployee(Email:string){
    const modal = this.tModalSvc.confirm({
      title:'Tạo tài khoản cho nhân viên',
      content: `<h5 class="text-success-500">Bạn có chắc chắn muốn tạo tài khoản cho <strong>${ Email }</strong> không?</h5>`,
      iconType:'tdsi-success-line',
      okText:'Tạo',
      size: 'md',
      cancelText:'Hủy',
      onOk:()=> true
    });
    modal.afterClose.asObservable().pipe(
      filter(condition => condition),
      concatMap(_=> this.auth.createAccountForEmployee(Email))
    ).subscribe((result)=>{
      if (result.status.toString() == 'Create Success!') {
        const modal = this.tModalSvc.success({
         title:'Thành công',
         content: `<h5 class="text-success-500">Tạo tài khoản <strong>${ Email }</strong> thành công! Tài khoản có mật khẩu là Spa@12345.</h5>`,
         footer:null,
         iconType:'tdsi-success-line',
         size:'lg',
         okText:'Xác nhận',
         onOk:()=> true
       });
       modal.afterClose.asObservable().pipe(tap(()=>  this.initUserList()))
       .subscribe
       ();
     }
     else{
        const modal = this.tModalSvc.error({
         title:'Thất bại',
         content: `<h5 class="text-error-500">Tạo tài khoản <strong>${ Email }</strong> thất bại! Tài khoản đã tồn tại hoặc đã xảy ra lỗi!</h5>`,
         footer:null,
         size:'lg',
         okText:'Xác nhận',
         onOk:()=> true
       });
       modal.afterClose.asObservable().pipe(tap(()=>  this.initUserList()))
       .subscribe();
     }
    }
    );
  }
  onEditUser(email:string,role:string,isActive:boolean){
    const modal = this.tModalSvc.create({
      title:'Sửa thông tin tài khoản',
      content: UsersModalComponent,
      footer:null,
      size:'xl',
      componentParams:{
        email,role,isActive
      }
    });
    modal.afterClose.asObservable().pipe(tap(()=>  this.initUserList())).subscribe()
  }
  deleteUser(email:string){
    const modal = this.tModalSvc.confirm({
      title:'Đổi trạng thái nhân viên',
      content: `<h5 class="text-error-500">Bạn có chắc chắn muốn đổi trạng thái chủa <strong>${ email }</strong> không?</h5>`,
      iconType:'tdsi-trash-line',
      okText:'Xóa',
      size: 'md',
      cancelText:'Hủy',
      onOk:()=> true
    });
    modal.afterClose.asObservable().pipe(
      filter(condition => condition),
      concatMap(_=> this.auth.deleteUser(email)),
      tap(()=>  this.initUserList())
    ).subscribe()
  }
  checkExistUser(email:string){
    this.auth.checkExistUser(email)
  }
}

