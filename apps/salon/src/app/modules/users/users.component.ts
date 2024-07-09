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
import { concatMap, filter, forkJoin, tap } from 'rxjs';
import { TDSButtonModule } from 'tds-ui/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSSelectModule } from 'tds-ui/select';
import { TDSCascaderModule, TDSCascaderOption } from 'tds-ui/cascader';
import * as moment from 'moment';

const roleOptions = [
  {
    value: 'All',
    label: 'All',
    isLeaf: true
},
  {
      value: 'Admin',
      label: 'Admin',
      isLeaf: true
  },
  {
      value: 'Employee',
      label: 'Employee',
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
    TDSCascaderModule
  ],
})
export class UsersComponent implements OnInit{
  tdsOptions: TDSCascaderOption[] = roleOptions;
  values: string[] = ['All'];
  private readonly tModalSvc =inject(TDSModalService)
  UserList:any[] = [];
  selectedUserType = this.values.toString();

  constructor(
    private auth : AuthService,
  ) {}
  onChanges(values: string[]): void {
    this.selectedUserType=this.values.toString()
    this.initUserList();
}
  ngOnInit(): void {
    this.initUserList();
  }
  
  initUserList() {  
    this.auth.UserList().subscribe(data => {
      this.UserList = data;
      if(this.selectedUserType==='All'){
        this.UserList
      }
      else if (this.selectedUserType === 'Admin') {        
        this.UserList = this.UserList.filter(user => user.Role === 'Admin');
      } else if (this.selectedUserType === 'Employee') {
        this.UserList = this.UserList.filter(user => user.Role !== 'Admin');
      }
    });
  }

  // Format Date & Time
  formatDate(date: string, format: string): string {
    return moment(date).format(format);
  }


  createUser(){
    const modal = this.tModalSvc.create({
      title:'Tạo tài khoản',
      content: UsersModalComponent,
      footer:null,
      size:'lg'
    });
    modal.afterClose.asObservable().pipe(tap(()=>  this.initUserList())).subscribe
    ();

  }
  createAccountForEmployee(Email:string){
    console.log(Email)
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
      //tap(()=>  this.initUserList())
    ).subscribe((result)=>{
      if (result.status.toString() == 'Create Success!') { 
        console.log(result.status)
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
       console.log(result.status)
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
      size:'lg',
      componentParams:{
        email,role,isActive
      }
    });
    modal.afterClose.asObservable().pipe(tap(()=>  this.initUserList())).subscribe()
  }
  deleteUser(email:string){
    console.log(email)
    const modal = this.tModalSvc.error({
      title:'Xóa tài khoản',
      content: `<h5 class="text-error-500">Bạn có chắc chắn muốn xóa tài khoản <strong>${ email }</strong> không?</h5>`,
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

