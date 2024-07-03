import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TDSTableModule } from 'tds-ui/table';
import { AuthService } from '../../shared.service';
import { RouterLink } from '@angular/router';
import { TDSModalService } from 'tds-ui/modal';
import { TreatmentDetailComponent } from './treatment-detail/treatment-detail.component';

@Component({
  selector: 'frontend-technical-staff',
  templateUrl: './technical-staff.component.html',
  styleUrls: ['./technical-staff.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TDSTableModule, RouterLink],
})
export class TechnicalStaffComponent {
  listSpaServiceQueue: any[] = [];
  private readonly tModalSvc = inject(TDSModalService)

  ngOnInit(): void {
    this.renderCustomerInQueue();
  }

  constructor(private auth: AuthService,) { }

  renderCustomerInQueue() {

    this.auth
      .getCustomerInQueueForTechnicalStaff(1, 'Treatment')
      .subscribe((x: any[]) => {
        this.listSpaServiceQueue = x
      });
  }

  //
  detailCustomerModelForStaff(data: any) {
    const modal = this.tModalSvc.create({
      title: 'Thông tin khách hàng',
      content: TreatmentDetailComponent,
      footer: null,
      size: 'lg',
      componentParams: {
        dataParent: data
      }
    });
    modal.afterClose.asObservable().subscribe(
      res => {
        if (res) {
          this.listSpaServiceQueue = [...this.listSpaServiceQueue.map((item: any) => {
            if (item.AppointmentID === data.AppointmentID) {
              return { ...item, ...res }
            }
            return item
          })]
          // this.renderCustomerInQueue()
        }
      })
  }
}
