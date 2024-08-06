import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  inject,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../shared.service';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSTimePickerModule } from 'tds-ui/time-picker';
import { TDSHeaderModule } from 'tds-ui/header';
import { TDSCardModule } from 'tds-ui/card';
import { TDSImageModule } from 'tds-ui/image';
import { format } from 'date-fns';
import { TDSEmptyModule } from 'tds-ui/empty';

@Component({
  selector: 'frontend-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TDSFormFieldModule,
    TDSTimePickerModule,
    TDSHeaderModule,
    TDSCardModule,
    TDSImageModule,
    TDSEmptyModule
  ],
})
export class UserProfileComponent implements OnInit, OnChanges {
  @Input() customerId?: number;
  @Input() checkChange: any;
  private readonly shared = inject(AuthService);
  serviceHistory: any;
  fallback = './assets/img/default.svg';

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['customerId']?.currentValue){
      this.getHistory(this.customerId as number);
    }
    if(changes['checkChange']?.currentValue ){
      this.getHistory(this.customerId as number);
    }
  }
  ngOnInit(): void {
    if (this.customerId) {
      this.getHistory(this.customerId);
    }
  }
  getHistory(id: number) {
    this.shared.getHistoryCustomer(id).subscribe((data: any) => {
      this.serviceHistory = data.listHistoryForCus.sort((a: any, b: any) =>
        b.date < a.date ? -1 : 1
      );
    });
  }
}
