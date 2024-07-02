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
import * as moment from 'moment';

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
  ],
})
export class UsersComponent implements OnInit{
  private readonly tModalSvc =inject(TDSModalService)
  UserList:any[] = [];
  selectedUserType = 'All';

  constructor(
    private auth : AuthService,
  ) {}


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
    modal.afterClose.asObservable().subscribe
    (res=>{
      if(res){
        this.initUserList()
      }
    });

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
      if (result.mess != null) { 
        console.log(result.mess)
        //this.createUser.reset();

        const modal = this.tModalSvc.confirm({
         title:'Thành công',
         content: `<h5 class="text-error-500">Tạo tài khoản <strong>${ Email }</strong> thành công! Tài khoản có mật khẩu là Spa@12345.</h5>`,
         footer:null,
         size:'lg',
         okText:'Xác nhận',
         onOk:()=> true
       });
       modal.afterClose.asObservable()
       .subscribe
       (tap(()=>  this.initUserList()));
     }
     else{
       console.log(result.mess)
        //this.createUser.reset();

        const modal = this.tModalSvc.create({
         title:'Thất bại',
         content: `<h5 class="text-error-500">Tạo tài khoản <strong>${ Email }</strong> thất bại! Tài khoản đã tồn tại hoặc đã xảy ra lỗi!</h5>`,
         footer:null,
         size:'lg',
         okText:'Xác nhận',
         onOk:()=> true
       });
       modal.afterClose.asObservable()
       .subscribe(tap(()=>  this.initUserList()));
     }
    }
    );
  }
  onEditUser(email:string){
    const modal = this.tModalSvc.create({
      title:'Sửa thông tin tài khoản',
      content: UsersModalComponent,
      footer:null,
      size:'lg',
      componentParams:{
        email
      }
    });
    modal.afterClose.asObservable().subscribe(res=>{
      if(res){
        this.initUserList()
      }
    })
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
}

