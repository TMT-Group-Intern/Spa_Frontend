import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../shared.service';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSTimePickerModule } from 'tds-ui/time-picker';
import { TDSHeaderModule } from 'tds-ui/header';
import { TDSCardModule } from 'tds-ui/card';
import { TDSImageModule } from 'tds-ui/image';
import { format } from 'date-fns';

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
  ],
})
export class UserProfileComponent implements OnInit {
  @Input() customerId?: number;
  private readonly shared = inject(AuthService);
  serviceHistory: any;
  fallback = './assets/img/default.svg';

  ngOnInit(): void {
    if (this.customerId) {
      this.shared.getHistoryCustomer(this.customerId).subscribe((data: any) => {
        this.serviceHistory = data.listHistoryForCus;
        console.log(this.serviceHistory);
      });
    }
  }
}
