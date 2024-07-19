import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TDSDatePickerModule } from 'tds-ui/date-picker';
import { TDSTabsModule } from 'tds-ui/tabs';

@Component({
  selector: 'frontend-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss'],
  standalone: true,
  imports:[
    CommonModule,
    TDSDatePickerModule,
    FormsModule,
    TDSTabsModule
  ]
})
export class AppointmentListComponent {

  rangeDate = null;

  onChange(result: Date): void {
    console.log('onChange: ', result);
}
}
