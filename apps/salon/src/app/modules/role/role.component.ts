import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared.service';
import { TDSDataTableModule } from 'tds-ui/data-table';
import { TDSEmptyModule } from 'tds-ui/empty';
import { TDSCollapseModule } from 'tds-ui/collapse';
import { TDSCheckBoxModule } from 'tds-ui/tds-checkbox';
import { TDSDropDownModule } from 'tds-ui/dropdown';

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
  ],
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
})
export class RoleComponent implements OnInit{
  jobType: any
  isClick = false
  jobName: any

  constructor(
    private shared: AuthService
  ){}

  ngOnInit(): void {
    this.shared.getJobType().subscribe(
      (data) => {
        this.jobType = data
      }
    )
  }

  getJob(jobType: any) {
    this.isClick = true
    this.jobName = jobType.dataRow.dataRow.jobTypeName
    console.log(jobType)
  }

}
