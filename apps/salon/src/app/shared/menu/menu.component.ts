import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSMenuModule } from 'tds-ui/menu';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { IsActiveMatchOptions, RouterModule } from "@angular/router";
import { TDSTagStatusType } from 'tds-ui/tag';
import { NgClassType } from 'tds-ui/core/config';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'frontend-menu',
  standalone: true,
  imports: [
    CommonModule,
    TDSMenuModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // host: {
  //   class: 'w-fit h-screen'
  // }
})


export class MenuComponent {
  isHovered = false;
  isCollapsed = true;
  activeTab = 1;
  active = 1;
  active1 = 'top';
  lstMenu: Array<TDSMenuDTO> = [
    {
      "name": "Tiếp tân",
      "icon": "tdsi-receive-fill",
      "link": "/home",
    },
    {
      "name": "Bác sĩ",
      "icon": "tdsi-earpiece-fill",
      "link": '/doctor'
    },
    {
      "name": "Nhân viên chăm sóc",
      "icon": "tdsi-auto-fix-fill",
      "link": '/technical-staff'
    },
    {
      "name": 'Khách hàng',
      "icon": "tdsi-group-people-fill",
      "link": '/customer-list'
    },
    {
      "name": 'Nhân viên',
      "icon": "tdsi-contact-fill",
      "link": '/users'
    },
    {
      "name": "Dịch vụ",
      "icon": "tdsi-list-product-fill",
      "link": '/service-list'
    },
    {
      "name": "Báo cáo ",
      "icon": "tdsi-bar-chart-fill",
      "listChild": [
        {
          "name": "Báo cáo ngày",
          "link": 'report/report-day'
        },
        {
          "name": "Báo cáo doanh thu",
          "link": 'report/revenue-statistics'
        },
      ]

    },
    {
      "name": "Lịch trình",
      "icon": "tdsi-calendar-fill",
      "link": '/schedule'
    },
    {
      "name": "Tra lịch hẹn",
      "icon": "tdsi-paper-fill",
      "link": '/appoitmentList'
    },
    {
      "name": "Chat box",
      "icon": "tdsi-chat-buble-fill",
      "link": '/chat-box'
    },
  ]

  setActiveTab(event: TDSSafeAny) {
    this.activeTab = event;
  }


  onMouseEnter() {
    this.isHovered = true;
  }

  onMouseLeave() {
    this.isHovered = false;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() { }



  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  onOpenChange(e: boolean) {
    this.isCollapsed = e;
  }
}


export interface TDSMenuDTO {
  name: string;
  icon?: string;
  link?: unknown;
  disabled?: boolean;
  listChild?: Array<TDSMenuDTO>;
  isSelected?: boolean;
  isOpen?: boolean;
  uid?: string,
  hidden?: boolean,
  groupTitle?: string;
  linkProps?: TDSMenuLinkPropsDTO;
  htmlIcon?: string;
  badge?: TDSMenuBadgeDTO;
  tag?: TDSMenuTagDTO;
  //dùng cho menu cấp cha
  dot?: TDSMenuDotDTO;
}

export interface TDSMenuLinkPropsDTO {
  queryParams?: { [k: string]: unknown };
  fragment?: string;
  queryParamsHandling?: 'merge' | 'preserve' | '';
  preserveFragment?: boolean;
  skipLocationChange?: boolean;
  replaceUrl?: boolean;
  state?: { [k: string]: unknown };
  routerLinkActiveOptions?: IsActiveMatchOptions;
  routerLinkActive?: string | string[];
}

export interface TDSMenuBadgeDTO {
  count: number;
  tdsStyle?: NgClassType;
  overflowCount: number;
}

export interface TDSMenuTagDTO {
  type?: 'default' | 'outline';
  status?: TDSTagStatusType;
  rounded?: string;
  text: string;
}

export interface TDSMenuDotDTO {
  status?: TDSTagStatusType;
}
