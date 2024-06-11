import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../shared/menu/menu.component';
import { TDSLayoutModule } from 'tds-ui/layout';
import { TDSHeaderModule } from 'tds-ui/header';
import { HeaderComponent } from '../shared/header/header.component';
import { ProductsComponent } from "../modules/products/products.component";
import { ServiceListComponent } from '../modules/service-list/service-list.component';
import { CustomerListComponent } from '../modules/customer-list/customer-list.component';
import { RevenueStaticsModule } from '../modules/revenue-statistics/revenue-statistics.module';
import { TDSMenuModule } from 'tds-ui/menu';

@Component({
    selector: 'frontend-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
      CommonModule,
      RouterModule,
      MenuComponent,
      HeaderComponent,
      TDSLayoutModule,
      TDSHeaderModule,
      ProductsComponent,
      ServiceListComponent,
      CustomerListComponent,
      TDSMenuModule,
      RevenueStaticsModule,
    ]
})
export class LayoutComponent {

}
