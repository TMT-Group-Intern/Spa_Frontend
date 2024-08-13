import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared.service';

@Component({
  selector: 'frontend-treasury',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './treasury.component.html',
  styleUrls: ['./treasury.component.scss'],
})
export class TreasuryComponent implements OnInit {

  cash: any;
  bank: any;

  ngOnInit(): void {
    this.GetFinance()
  }

  constructor(private shareApi: AuthService,) {

  }

  GetFinance() {
    this.shareApi.getFinance().subscribe(
      (data: any) => {
        console.log(data);

        this.cash = data.cash,
          this.bank = data.bank
      }
    )
  }
}
