import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../shared/menu/menu.component';
import { TDSLayoutModule } from 'tds-ui/layout';
import { TDSHeaderModule } from 'tds-ui/header';
import { HeaderComponent } from '../shared/header/header.component';
import { ProductsComponent } from "../modules/products/products.component";
import { PaginationComponent } from '../shared/pagination/pagination.component';

@Component({
    selector: 'frontend-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [CommonModule, RouterModule, MenuComponent, HeaderComponent, TDSLayoutModule, TDSHeaderModule, ProductsComponent,PaginationComponent]
})
export class LayoutComponent {}