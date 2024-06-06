import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RegisterComponent } from '../register/register.component';
import { TDSHeaderModule } from 'tds-ui/header';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSSelectModule } from 'tds-ui/select';
import { FormsModule } from '@angular/forms';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSInputModule } from 'tds-ui/tds-input';
import { HeaderComponent } from '../../shared/header/header.component';
import { MenuComponent } from '../../shared/menu/menu.component';


@Component({
    selector: 'frontend-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [CommonModule, RegisterComponent,TDSHeaderModule,TDSFormFieldModule,TDSSelectModule,FormsModule,
        TDSButtonModule, TDSInputModule,HeaderComponent,MenuComponent
    ]
})
export class HomeComponent  {
  public contact = 1;
     public contactOptions=[ { id: 1, name: ' Elton John ' },
    { id: 2, name: 'Elvis Presley' },
    { id: 3, name: 'Paul McCartney' },
    { id: 4, name: 'Elton John' },
    { id: 5, name: 'Elvis Presley' },
    { id: 6, name: 'Paul McCartney' }]
// eslint-disable-next-line @typescript-eslint/no-empty-function
constructor() { }

}
