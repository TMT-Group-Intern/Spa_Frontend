import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { TDSMenuComponent, TDSMenuDTO, TDSMenuModule } from 'tds-ui/menu';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { SidebarComponent } from "../../layout/sidebar/sidebar.component";
import { MenuComponent } from '../../shared/menu/menu.component';


@Component({
    selector: 'frontend-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property
    host: { class: "flex w-full" },
    imports: [CommonModule, TDSMenuModule, SidebarComponent, MenuComponent]
})
export class HomeComponent  {



}
