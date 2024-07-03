import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../shared/menu/menu.component';
import { TDSLayoutModule } from 'tds-ui/layout';
import { TDSHeaderModule } from 'tds-ui/header';
import { HeaderComponent } from '../shared/header/header.component';
import { RevenueStaticsModule } from '../modules/revenue-statistics/revenue-statistics.module';
import { TDSMenuModule } from 'tds-ui/menu';
import { UsersComponent } from '../modules/users/users.component';
import { CustomerDetailComponent } from '../modules/customer-list/customer-detail/customer-detail.component';

@Component({
    selector: 'frontend-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
      CommonModule,
      TDSLayoutModule,
      TDSHeaderModule,
      TDSMenuModule,
      RouterModule,
      MenuComponent,
      HeaderComponent,
      RevenueStaticsModule,
      UsersComponent,
      CustomerDetailComponent
    ]
})
export class LayoutComponent {

}
