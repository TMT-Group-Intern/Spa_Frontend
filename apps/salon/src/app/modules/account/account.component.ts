import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../shared.service';
import { TDSCascaderModule, TDSCascaderOption } from 'tds-ui/cascader';
import { BehaviorSubject, concatMap, filter, tap } from 'rxjs';
import { TDSModalService } from 'tds-ui/modal';
import * as moment from 'moment';
import { UsersModalComponent } from '../users/users-modal/users-modal.component';
import { CommonModule } from '@angular/common';
import { TDSListModule } from 'tds-ui/list';
import { TDSDataTableModule } from 'tds-ui/data-table';
import { TDSColumnSettingsModule } from 'tds-ui/column-settings';
import { TDSTimelineModule } from 'tds-ui/timeline';
import { TDSToolTipModule } from 'tds-ui/tooltip';
import { TDSButtonModule } from 'tds-ui/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSSelectModule } from 'tds-ui/select';
import { TDSPaginationModule } from 'tds-ui/pagination';
import { AccountModalComponent } from './account-modal/account-modal.component';
import { AdminModalComponent } from './admin-modal/admin-modal.component';

const roleOptions = [
  {
    value: 'All',
    label: 'Tất cả',
    isLeaf: true
  },
  {
    value: 'true',
    label: 'Đang hoạt động',
    isLeaf: true
  },
  {
    value: 'false',
    label: 'Ngừng hoạt động',
    isLeaf: true
  }

];
@Component({
  selector: 'frontend-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
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
export class AccountComponent implements OnInit {
  tdsOptions: TDSCascaderOption[] = roleOptions;
  values: string[] = ['All'];
  _change$ = new BehaviorSubject<string>('');
  private readonly tModalSvc = inject(TDSModalService)
  AccountList: any;
  selectedUserType = this.values.toString();
  userSession: any;
  pageNumber: any = 1
  pageSize: any = 10
  totalItemsUsers: any

  constructor(
    private auth: AuthService,
  ) { }
  onChanges(values: string[]): void {
    this.selectedUserType = this.values.toString()
    this.initAccountList();
  }
  ngOnInit(): void {
    this.initAccountList();
    const storedUserSession = localStorage.getItem('userSession');
    if (storedUserSession !== null) {
      this.userSession = JSON.parse(storedUserSession);
    }
  }

  initAccountList() {
    this.auth.pageAccountByPages(this.pageNumber, this.pageSize).subscribe((data: any) => {
      this.AccountList = data.item;
      this.totalItemsUsers = data.totalItems;
      if (this.selectedUserType === 'All') {
        this.AccountList
      }
      else if (this.selectedUserType === 'true') {
        this.auth.pageActiveAccountByPages(this.pageNumber, this.pageSize)
          .subscribe((data: any) => {
            this.AccountList = data.item;
            this.totalItemsUsers = data.totalItems;
          })
      }
      else {
        this.auth.pageNotActiveAccountByPages(this.pageNumber, this.pageSize)
          .subscribe((data: any) => {
            this.AccountList = data.item;
            this.totalItemsUsers = data.totalItems;
          })
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
    this.initAccountList();
  }
  // get back changeSizePage
  changeSizePage(event: number): void {
    this.pageSize = event;
    this.initAccountList();
  }

  onRefresh(event: MouseEvent): void {
    this.pageNumber = 1;
    this.initAccountList();
  }
  createAccount() {
    const modal = this.tModalSvc.create({
      title: 'Thêm nhân viên',
      content: AccountModalComponent,
      footer: null,
      size: 'xl'
    });
    modal.afterClose.asObservable().pipe(tap(() => this.initAccountList())).subscribe
      ();
  }

  createAdmin() {
    const modal = this.tModalSvc.create({
      title: 'Thêm quản lý',
      content: AdminModalComponent,
      footer: null,
      size: 'xl'
    });
    modal.afterClose.asObservable().pipe(tap(() => this.initAccountList())).subscribe
      ();
  }
  onEditAccount(id: string, role: string, isActive: boolean, lastName: string, firstName: string) {
    const modal = this.tModalSvc.create({
      title: 'Sửa thông tin tài khoản',
      content: AccountModalComponent,
      footer: null,
      size: 'md',
      componentParams: {
        id, role, isActive, lastName, firstName
      }
    });
    modal.afterClose.asObservable().pipe(tap(() => this.initAccountList())).subscribe()
  }

  changeStatusAccount(userName: string) {
    const modal = this.tModalSvc.confirm({
      title: 'Đổi trạng thái tài khoản',
      content: `<h5 class="text-success-500">Bạn có chắc chắn muốn đổi trạng thái tài khoản <strong>${userName}</strong> không?</h5>`,
      iconType: 'tdsi-block-1-fill',
      okText: 'Xác nhận',
      size: 'md',
      cancelText: 'Hủy',
      onOk: () => true
    });
    modal.afterClose.asObservable().pipe(
      filter(condition => condition),
      concatMap(_ => this.auth.changeStatusAccount(userName)),
      tap(() => this.initAccountList())
    ).subscribe()
  }

  deleteAccount(userName: string) {
    const modal = this.tModalSvc.error({
      title: 'Xóa tài khoản',
      content: `<h5 class="text-error-500">Bạn có chắc chắn muốn xóa tài khoản <strong>${userName}</strong> không?</h5>`,
      iconType: 'tdsi-trash-line',
      okText: 'Xóa',
      size: 'md',
      cancelText: 'Hủy',
      onOk: () => true
    });
    modal.afterClose.asObservable().pipe(
      filter(condition => condition),
      concatMap(_ => this.auth.deleteAccount(userName)),
      tap(() => this.initAccountList())
    ).subscribe()
  }

  checkExistUser(email: string) {
    this.auth.checkExistUser(email)
  }
}

