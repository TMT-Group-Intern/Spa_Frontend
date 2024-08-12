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
  jobTypeID: any;
  permissions: any[] = [];
  permissionName: any;
  rolePermissions: any;

  constructor(private shared: AuthService) {}

  ngOnInit(): void {
    this.shared.getJobTypeForPermission().subscribe((data) => {
      this.jobType = data;
    });
    this.getAllPermissions();
  }

  getJob(jobType: any) {
    this.isClick = true;
    this.jobName = jobType.dataRow.dataRow.jobTypeName;
    this.jobTypeID = jobType.dataRow.dataRow.jobTypeID;
    this.getRolePermissions(this.jobTypeID);
  }

  getAllPermissions() {
    this.shared.getAllPermissions().subscribe((permission) => {
      this.permissions = permission.map((item) => ({
        title: item.permissionName,
        key: item.permissionID.toString(),
        permissionID: item.permissionID,
        checked: false,
      }));
    });
  }

  getRolePermissions(jobTypeID: any) {
    this.shared.getRolePermissions(jobTypeID).subscribe((rolePer) => {
      this.rolePermissions = rolePer.map((permission) => ({
        permissionID: permission.permissionID,
        title:
          this.permissions.find(
            (p) => p.permissionID === permission.permissionID
          )?.title || '',
      }));
      this.updatePermissionsCheckedState(this.rolePermissions);
    });
  }

  updatePermissionsCheckedState(rolePermissions: { permissionID: number }[]) {
    this.permissions = this.permissions.map((permission) => {
      const matchingRole = rolePermissions.find(
        (role) => role.permissionID === permission.permissionID
      );
      return {
        ...permission,
        checked: !!matchingRole,
      };
    });
  }

  onClick(event: TDSSafeAny): void {
    console.log(event);
  }

  onCheck(event: TDSFormatEmitEvent): void {
    console.log(event);
  }
}
