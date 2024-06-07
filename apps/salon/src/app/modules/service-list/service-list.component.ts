import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSDataTableModule } from 'tds-ui/data-table';
import { TDSAvatarModule } from 'tds-ui/avatar';
import { TDSCheckBoxModule } from 'tds-ui/tds-checkbox';
import { TDSTableModule } from 'tds-ui/table';
import { TDSColumnSettingsModule } from 'tds-ui/column-settings';

interface ItemData {
  id: number;
  name: string;
  age: number;
  address: string;
  createDate: Date;
  value: number;
  avatar: string;
}

@Component({
  selector: 'frontend-service-list',
  standalone: true,
  imports: [CommonModule, TDSDataTableModule, TDSAvatarModule, TDSCheckBoxModule, TDSTableModule, TDSColumnSettingsModule],
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss'],
})
export class ServiceListComponent implements OnInit {

  listOfData: ItemData[] = [];

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        constructor() {}

        ngOnInit(): void {
            const data = [];
            for (let i = 0; i < 50; i++) {
                data.push({
                    id: i,
                    name: `Edward King ${i}`,
                    age: 32,
                    address: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut
                    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                    voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                    cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet,
                    consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat. ${i}`,
                    createDate: new Date(),
                    value: Math.floor(Math.random() * 200000000),
                    avatar: `https://randomuser.me/api/portraits/women/${Math.floor(Math.random() * 100)}.jpg`,
                });
            }
            this.listOfData = data;
  }

}
