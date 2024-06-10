import { TDSMapperPipeModule } from 'tds-ui/cdk/pipes/mapper';
import { TDSDataTableModule } from 'tds-ui/data-table';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  TDSTableQueryParams } from 'tds-ui/table';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TDSColumnSettingsDTO, TDSColumnSettingsModule } from 'tds-ui/column-settings';
import { Observable, catchError, of } from 'rxjs';
import { TDSListModule } from 'tds-ui/list';
import { ReactiveFormsModule } from '@angular/forms';
import { TDSAvatarModule } from 'tds-ui/avatar';

interface TDSDemoRandomUser {
  gender: string;
  email: string;
  name: {
      title: string;
      first: string;
      last: string;
  };
  phone: string;
  picture: {
      large: string;
      medium: string;
      thumbnail: string;
  },
  registered: {
      age: number;
      date: Date
  }
}

@Component({
  selector: 'frontend-customer-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,TDSListModule, TDSDataTableModule,TDSColumnSettingsModule,TDSAvatarModule,TDSMapperPipeModule],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent  {

  listColumn: TDSColumnSettingsDTO[] = [
    {
        tdsTitle: 'Avatar',
        tdsField: 'name.picture.thumbnail',
        tdsChecked: true
    },
    {
        tdsTitle: 'Họ và tên',
        tdsField: 'name.first',
        tdsChecked: true
    },
    {
        tdsTitle: 'Giới tính',
        tdsField: 'gender',
        tdsChecked: true
    },
    {
        tdsTitle: 'Tuổi',
        tdsField: 'registered.age',
        tdsChecked: true
    }
        ,
    {
        tdsTitle: 'Email',
        tdsField: 'email',
        tdsChecked: true
    }
        ,
    {
        tdsTitle: 'Số điện thoại',
        tdsField: 'phone',
        tdsChecked: true
    }
  ]
  total = 1;
  listOfRandomUser: TDSDemoRandomUser[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  tdsPageSizeOptions = [10,20, 30, 40, 50];
  randomUserUrl = 'https://api.randomuser.me/';

  loadDataFromServer(
      pageIndex: number,
      pageSize: number,
  ): void {
      this.loading = true;
      this.getUsers(pageIndex, pageSize).subscribe(data => {
          this.loading = false;
          this.total = 200; // mock the total data here
          this.listOfRandomUser = data.results;
      });
  }
  onQueryParamsChange(params: TDSTableQueryParams): void {
      const { pageSize, pageIndex } = params;
      this.loadDataFromServer(pageIndex, pageSize);
  }

  constructor(private http: HttpClient) { }


  resetPage() {
      this.pageIndex = 1;
  }
  onDataColumnChange(e: TDSColumnSettingsDTO[]) {
      this.listColumn = [...e]
  }
  readonly mapperHiddenColumn = (listColumn: TDSColumnSettingsDTO[], field: string) => {
      return listColumn.find(col => col.tdsField == field && !col.tdsChecked) != undefined
  }
  getUsers(
      pageIndex: number,
      pageSize: number
  ): Observable<{ results: TDSDemoRandomUser[] }> {
      const params = new HttpParams()
          .append('page', `${pageIndex}`)
          .append('results', `${pageSize}`);
      return this.http
          .get<{ results: TDSDemoRandomUser[] }>(`${this.randomUserUrl}`, { params })
          .pipe(catchError(() => of({ results: [] })));
  }
}
