import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { AuthService } from '../../../shared.service';
import { TTypeState } from '../appointment-list.component';
import { TDSModalService } from 'tds-ui/modal';
import { ChooseDoctorModalComponent } from '../../home/choose-doctor-modal/choose-doctor-modal.component';
import { InSessionModalComponent } from '../../home/in-session-modal/in-session-modal.component';
import { PaymentModalComponent } from '../../home/payment-modal/payment-modal.component';

@Component({
  selector: 'frontend-appointment-table-list',
  templateUrl: './appointment-table-list.component.html',
  styleUrls: ['./appointment-table-list.component.scss'],
})
export class AppointmentTableListComponent implements OnChanges {
  private readonly shareApi = inject(AuthService);
  private readonly modalSvc = inject(TDSModalService);
  @Input() branchId?: number;
  @Input() tabCurStr!: TTypeState;
  @Input() startDay: string | undefined;
  @Input() endDay: string | undefined;
  @Input() search?: string;
  @Input() boolean$?: boolean;
  listOfData: any;
  listOfAllData: any;
  temp: any;
  pageNumber = 1;
  pageSize = 10;
  totalItemsCustomers: any;
  isLoading=false;

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['search']?.currentValue ||
      changes['search']?.currentValue === ''||
      changes['startDay']?.currentValue ||
      changes['endDay']?.currentValue ||
      changes['tabCurStr']?.currentValue ||
      changes['branchId']?.currentValue ||
      changes['boolean$']?.currentValue === true ||
      changes['boolean$']?.currentValue === false
    ){
      this.checkChanges();
    }
  }

  // kiểm tra nội dung tìm kiếm
  checkChanges(): void {
    if (this.search == '') {
      this.initListAppointment();
    } else {
      if (this.tabCurStr === 'Tất cả') {
        console.log(this.tabCurStr)
        this.searchAppointment(this.search as string, '');
      } else {
        console.log(this.tabCurStr)
        this.searchAppointment(this.search as string, this.tabCurStr);
      }
    }
  }
  // Kiểm tra trạng thái để chạy vào hàm thích hợp
  initListAppointment(): void {
    if (this.tabCurStr === 'Tất cả') {
      this.initAppointmentByDays(
        this.startDay as string,
        this.endDay as string
      );
    } else {
      this.initAppointmentByDaysWithStatus();
    }
  }
  // lấy danh sách tất cả theo thời gian
  initAppointmentByDays(fromDate: string, toDate: string): void {
    this.isLoading=true;
    this.shareApi
      .getAppointmentByDays(
        this.branchId as number,
        fromDate,
        toDate,
        this.pageNumber as number,
        this.pageSize as number
      )
      .subscribe((data: any) => {
        this.totalItemsCustomers = data.totalItems;
        this.listOfData = data.items.sort((a: any, b: any) =>
          a.appointmentDate > b.appointmentDate ? -1 : 1
        );
      },error => {
        console.log('Error!')
      }, () => {
        this.isLoading = false; // Kết thúc loading
      });
  }
  // cập nhật trạng thái
  updateAppointmentStatus(
    idAppointment: number,
    statusAppointment: string
  ): void {
    this.shareApi
      .UpdateStatus(idAppointment, statusAppointment)
      .subscribe(() => {
        this.initListAppointment();
      });
  }
  // tìm kiếm theo trạng thái và tìm kiếm theo tất cả
  searchAppointment(search: string, status: string): void {
    this.shareApi
      .searchAppointmentByDays(
        this.startDay as string,
        this.endDay as string,
        this.branchId as number,
        search,
        this.pageSize,
        this.pageNumber,
        status
      )
      .subscribe((data) => {
        this.totalItemsCustomers = data.totalItems;
        this.listOfData = data.items.sort((a: any, b: any) =>
          a.appointmentDate > b.appointmentDate ? -1 : 1
        );
      });
  }
  // lấy danh sách với trạng thái
  initAppointmentByDaysWithStatus(): void {
    this.isLoading=true
    this.shareApi
      .getAppointmentByDaysWithStatus(
        this.branchId as number,
        this.startDay as string,
        this.endDay as string,
        this.pageNumber as number,
        this.pageSize as number,
        this.tabCurStr
      )
      .subscribe((data) => {
        this.totalItemsCustomers = data.totalItems;
        this.listOfData = data.items.sort((a: any, b: any) =>
          a.appointmentDate > b.appointmentDate ? -1 : 1
        );
      },error => {
        console.log('Error!')
      }, () => {
        this.isLoading = false; // Kết thúc loading
      });
  }
  // call modal
  callModalEditAppointment(id: number, status: string, date: string) {
    this.shareApi.getAppointment(id).subscribe((data: any) => {
      if (data.doctor === null) {
        const modal = this.modalSvc.create({
          title: 'Cập nhật bác sĩ',
          content: ChooseDoctorModalComponent,
          footer: null,
          size: 'md',
          componentParams: {
            id: id,
            appointmentDate: date,
          },
        });
        modal.afterClose.asObservable().subscribe((data) => {
          if (data) {
            this.updateAppointmentStatus(id, status);
          }
        });
      } else {
        this.updateAppointmentStatus(id, status);
      }
    });
  }
  // call modal
  callModalUpdate(id: number) {
    const modal = this.modalSvc.create({
      title: 'Thêm kỹ thuật viên',
      content: InSessionModalComponent,
      footer: null,
      size: 'md',
      componentParams: {
        id: id,
      },
    });
    modal.afterClose.asObservable().subscribe((data) => {
      if (data) {
        this.initListAppointment();
      }
    });
  }
  // call modal chi tiết hóa đơn sau khi hoàn tất thanh toán.
  callModalDetailBillComplete(id: number) {
    this.modalSvc.create({
      title: 'Chi tiết hóa đơn',
      content: PaymentModalComponent,
      footer: null,
      size: 'lg',
      componentParams: {
        id: id
      }
    })
  }
  changeNumberPage(event: number): void {
    this.pageNumber = event;
    this.checkChanges();
  }
  changeSizePage(event: number): void {
    this.pageSize = event;
    this.checkChanges();
  }
  onRefresh(event: MouseEvent): void {
    this.pageNumber = 1;
    this.checkChanges();
  }
  onClickGetCustomerId(customerID: number) {
    localStorage.setItem('customerID', JSON.stringify(customerID));
  }
}
