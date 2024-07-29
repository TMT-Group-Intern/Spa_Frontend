import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { format } from 'date-fns';
import { DATE_CONFIG } from '../../../core/enums/date-format.enum';
import { AuthService } from '../../../shared.service';
import { CompanyService } from '../../../core/services/company.service';
import { concatMap, filter } from 'rxjs';

@Component({
  selector: 'frontend-revenue-statistics-detail',
  templateUrl: './revenue-statistics-detail.component.html',
  styleUrls: ['./revenue-statistics-detail.component.scss'],
})
export class RevenueStatisticsDetailComponent implements OnChanges  {
  private readonly sharedServices = inject(AuthService)
  @Input() date?: Date;
  @Input() branchId?: number;

  listOfDataDetail: any;
  private readonly company = inject(CompanyService);

  constructor(
    private sharedService: AuthService,
    private companySvc: CompanyService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['branchId']?.currentValue||changes['date']?.currentValue){
      this.onChangeShowDetail(this.date as Date);
    }
  }

  // Hiển thị chi tiết danh sách giao dịch thanh toán của 1 ngày
  onChangeShowDetail(date: Date): void {
    const fromDay = format(date, DATE_CONFIG.DATE_BASE_FROM);
    const fromTo = format(date, DATE_CONFIG.DATE_BASE_TO);
    this.sharedServices
      .getDetails(
        this.branchId as number,
        fromDay as unknown as string,
        fromTo as unknown as string
      )
      .subscribe((data: any) => {
        this.listOfDataDetail = data;
      });
  }
}
