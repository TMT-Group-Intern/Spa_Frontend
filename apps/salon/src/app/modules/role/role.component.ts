import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared.service';
import { TDSDataTableModule } from 'tds-ui/data-table';
import { TDSEmptyModule } from 'tds-ui/empty';
import { TDSCollapseModule } from 'tds-ui/collapse';
import { TDSCheckBoxModule } from 'tds-ui/tds-checkbox';
import { TDSDropDownModule } from 'tds-ui/dropdown';
import {
  TDSFormatEmitEvent,
  TDSTreeModule,
  TDSTreeNodeOptions,
} from 'tds-ui/tree';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'frontend-role',
  standalone: true,
  imports: [
    CommonModule,
    TDSDataTableModule,
    TDSEmptyModule,
    TDSCollapseModule,
    TDSCheckBoxModule,
    TDSDropDownModule,
    TDSTreeModule,
  ],
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
})
export class RoleComponent implements OnInit {
  jobType: any;
  isClick = false;
  jobName: any;

  // defaultCheckedKeys = ["10020"];
  // defaultSelectedKeys = ["10010"];
  // defaultExpandedKeys = ["100", "1001"];

  nodes = [
    // Khách hàng
    {
      title: 'Khách hàng',
      key: '0',
      children: [
        {
          title: 'Thêm',
          key: '0-0',
          isLeaf: true,
        },
        {
          title: 'Sửa',
          key: '0-1',
          isLeaf: true,
        },
        {
          title: 'Xóa',
          key: '0-2',
          isLeaf: true,
        },
      ],
    },

    // Tiếp tân
    {
      title: 'Tiếp tân',
      key: '1',
      children: [
        {
          title: 'Thêm',
          key: '1-0',
          isLeaf: true,
        },
        {
          title: 'Sửa',
          key: '1-1',
          isLeaf: true,
        },
        {
          title: 'Xóa',
          key: '1-2',
          isLeaf: true,
        },
      ],
    },

    // Bác sĩ
    {
      title: 'Bác sĩ',
      key: '2',
      children: [
        {
          title: 'Thêm',
          key: '2-0',
          isLeaf: true,
        },
        {
          title: 'Sửa',
          key: '2-1',
          isLeaf: true,
        },
        {
          title: 'Xóa',
          key: '2-2',
          isLeaf: true,
        },
      ],
    },

    // Nhân viên chăm sóc
    {
      title: 'Nhân viên chăm sóc',
      key: '3',
      children: [
        {
          title: 'Thêm',
          key: '3-0',
          isLeaf: true,
        },
        {
          title: 'Sửa',
          key: '3-1',
          isLeaf: true,
        },
        {
          title: 'Xóa',
          key: '3-2',
          isLeaf: true,
        },
      ],
    },

    // Nhân viên
    {
      title: 'Nhân viên',
      key: '4',
      children: [
        {
          title: 'Thêm',
          key: '4-0',
          isLeaf: true,
        },
        {
          title: 'Sửa',
          key: '4-1',
          isLeaf: true,
        },
        {
          title: 'Xóa',
          key: '4-2',
          isLeaf: true,
        },
      ],
    },

    // Dịch vụ
    {
      title: 'Dịch vụ',
      key: '5',
      children: [
        {
          title: 'Thêm',
          key: '5-0',
          isLeaf: true,
        },
        {
          title: 'Sửa',
          key: '5-1',
          isLeaf: true,
        },
        {
          title: 'Xóa',
          key: '5-2',
          isLeaf: true,
        },
      ],
    },

    // Báo cáo doanh thu
    {
      title: 'Báo cáo doanh thu',
      key: '6',
      children: [
        {
          title: 'Báo cáo ngày',
          key: '6-0',
          isLeaf: true,
        },
        {
          title: 'Báo cáo doanh thu',
          key: '6-1',
          isLeaf: true,
        },
      ],
    },

    // Nhóm quyền
    {
      title: 'Nhóm quyền',
      key: '7',
      isLeaf: true,
    },

    // Chat box
    {
      title: 'Chat box',
      key: '8',
      isLeaf: true,
    },
  ];

  constructor(private shared: AuthService) {}

  ngOnInit(): void {
    this.shared.getJobType().subscribe((data) => {
      this.jobType = data;
    });
  }

  getJob(jobType: any) {
    this.isClick = true;
    this.jobName = jobType.dataRow.dataRow.jobTypeName;
    console.log(jobType);
  }

  onClick(event: TDSSafeAny): void {
    console.log(event);
  }

  onCheck(event: TDSFormatEmitEvent): void {
    console.log(event);
  }
}
