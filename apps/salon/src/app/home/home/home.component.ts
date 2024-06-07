import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { TDSMenuModule } from 'tds-ui/menu';
import { MenuComponent } from '../../shared/menu/menu.component';


@Component({
    selector: 'frontend-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property
    host: { class: "flex w-full" },
    imports: [CommonModule, TDSMenuModule, MenuComponent]
})
export class HomeComponent  {



}
