import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSHeaderModule } from 'tds-ui/header';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSSelectModule } from 'tds-ui/select';
import { FormsModule } from '@angular/forms';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSInputModule } from 'tds-ui/tds-input';

@Component({
  selector: 'frontend-header',
  standalone: true,
  imports: [CommonModule,TDSHeaderModule,TDSFormFieldModule,TDSSelectModule,FormsModule,
    TDSButtonModule, TDSInputModule,],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  {
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
