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
      "name": "Reception",
      "icon": "tdsi-receive-fill",
      "link": "/home",
    },
    {
      "name": "Doctor",
      "icon": "tdsi-earpiece-fill",
      "link": '/doctor'
    },
    {
      "name": "Spa Therapist",
      "icon": "tdsi-auto-fix-fill",
      "link": '/technical-staff'
    },
    {
      "name": 'Customer',
      "icon": "tdsi-group-people-fill",
      "link": '/customer-list'
    },
    {
      "name": 'Users',
      "icon": "tdsi-contact-fill",
      "link": '/users'
    },
    {
      "name": "Service",
      "icon": "tdsi-list-product-fill",
      "link": '/service-list'
    },
    {
      "name": "Báo cáo doanh thu",
      "icon": "tdsi-revenue-fill",
      "link": '/revenue-statistics'
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
