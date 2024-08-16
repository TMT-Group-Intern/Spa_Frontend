import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TDSColumnSettingsModule } from 'tds-ui/column-settings';
import { TDSDataTableModule } from 'tds-ui/data-table';
import { TDSListModule } from 'tds-ui/list';
import { UsersModalComponent } from '../users/users-modal/users-modal.component';
import { TDSTimelineModule } from 'tds-ui/timeline';
import { TDSToolTipModule } from 'tds-ui/tooltip';
import { TDSButtonModule } from 'tds-ui/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSSelectModule } from 'tds-ui/select';
import { TDSCascaderModule, TDSCascaderOption } from 'tds-ui/cascader';
import { TDSPaginationModule } from 'tds-ui/pagination';
import { BehaviorSubject, concatMap, filter, tap } from 'rxjs';
import { TDSModalService } from 'tds-ui/modal';
import { AuthService } from '../../shared.service';
import * as moment from 'moment';
import { BranchModalComponent } from './branch-modal/branch-modal.component';

const options = [
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
  }]

@Component({
  selector: 'frontend-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss'],
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

export class BranchComponent implements OnInit{
  tdsOptions: TDSCascaderOption[] = options;
  values: string[] = ['All'];
  _change$ = new BehaviorSubject<string>('');
  private readonly tModalSvc = inject(TDSModalService)
  BranchList: any;
  selectedBranchType = this.values.toString();
  userSession: any;
  pageNumber: any = 1
  pageSize: any = 10
  totalItemsBranchs: any

  constructor(
    private auth: AuthService,
  ) { }
  onChanges(values: string[]): void {
    this.selectedBranchType = this.values.toString()
    this.initBranchList();
  }
  ngOnInit(): void {
    this.initBranchList();
    const storedUserSession = localStorage.getItem('userSession');
    if (storedUserSession !== null) {
      this.userSession = JSON.parse(storedUserSession);
    }
  }

  initBranchList() {
    this.auth.pageBranchByPages(this.pageNumber, this.pageSize).subscribe((data: any) => {
      this.BranchList = data.item;
      this.totalItemsBranchs = data.totalItems;
      if (this.selectedBranchType === 'All') {
        this.BranchList
      }
      else if (this.selectedBranchType === 'true') {
        this.auth.pageActiveBranchByPages(this.pageNumber, this.pageSize)
          .subscribe((data: any) => {
            this.BranchList = data.item;
            this.totalItemsBranchs = data.totalItems;
          })
      }
      else {
        this.auth.pageNotActiveBranchByPages(this.pageNumber, this.pageSize)
          .subscribe((data: any) => {
            this.BranchList = data.item;
            this.totalItemsBranchs = data.totalItems;
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
    this.initBranchList();
  }
  // get back changeSizePage
  changeSizePage(event: number): void {
    this.pageSize = event;
    this.initBranchList();
  }

  onRefresh(event: MouseEvent): void {
    this.pageNumber = 1;
    this.initBranchList();
  }

  createBranch() {
    const modal = this.tModalSvc.create({
      title: 'Thêm chi nhánh',
      content: BranchModalComponent,
      footer: null,
      size: 'md'
    });
    modal.afterClose.asObservable().pipe(tap(() => this.initBranchList())).subscribe
      ();
  }

  onEditBranch(id: number) {
    console.log(id)
    const modal = this.tModalSvc.create({
      title: 'Sửa thông tin chi nhánh',
      content: BranchModalComponent,
      footer: null,
      size: 'md',
      componentParams: {
        id
      }
    });
    modal.afterClose.asObservable().pipe(tap(() => this.initBranchList())).subscribe()
  }

  changeStatusBranch(id: number) {
    const modal = this.tModalSvc.confirm({
      title: 'Đổi trạng thái chi nhánh',
      content: `<h5 class="text-success-500">Bạn có chắc chắn muốn đổi trạng thái của chi nhánh không?</h5>`,
      iconType: 'tdsi-block-1-fill',
      okText: 'Xác nhận',
      size: 'md',
      cancelText: 'Hủy',
      onOk: () => true
    });
    modal.afterClose.asObservable().pipe(
      filter(condition => condition),
      concatMap(_ => this.auth.changeStatusBranch(id)),
      tap(() => this.initBranchList())
    ).subscribe()
  }

  deleteBranch(id: any) {
    console.log(id)
    const modal = this.tModalSvc.error({
      title: 'Xóa chi nhánh',
      content: `<h5 class="text-error-500">Bạn có chắc chắn muốn xóa chi nhánh không?</h5>`,
      iconType: 'tdsi-trash-line',
      okText: 'Xóa',
      size: 'md',
      cancelText: 'Hủy',
      onOk: () => true
    });
    modal.afterClose.asObservable().pipe(
      filter(condition => condition),
      concatMap(_ => this.auth.deleteBranch(id)),
      tap(() => this.initBranchList())
    ).subscribe()
  }

}

