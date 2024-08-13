import { Component, inject, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { format } from 'date-fns';
import { DATE_CONFIG } from '../../../core/enums/date-format.enum';
import { AuthService } from '../../../shared.service';
import { TDSNotificationService } from 'tds-ui/notification';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'frontend-modal-treatment-plan',
  templateUrl: './modal-treatment-plan.component.html',
  styleUrls: ['./modal-treatment-plan.component.scss'],
})
export class ModalTreatmentPlanComponent implements OnInit {

  private readonly sharesApi = inject(AuthService);
  private readonly notification = inject(TDSNotificationService);
  private readonly modalRef = inject(TDSModalRef);

  @Input() customerId?: number;
  @Input() treatmentId?: number;

  treatmentForm: FormGroup;

  inputValue?: string;
  selectSessionOptions = 1;
  listSearch: any[] = [];
  byName = '';
  number = 1;
  totalService = 0;
  numberValue = 1;
  totalDiscount = 0;
  total = 0;

  sessionChosen: number[] = [];
  listService: TDSSafeAny;
  listOfData: any[] = [];

  userSession: any;
  storedUserSession = localStorage.getItem('userSession');

  sessionFormGroup: any;
  options: TDSSafeAny;

  constructor(private fb: FormBuilder) {
    this.treatmentForm = this.fb.group({
      // treatmentName: ['', Validators.required],
      customerID: [''],
      startDate: format(new Date(), DATE_CONFIG.DATE_BASE),
      createBy: [''],
      note: [''],
      // service: [],
      // totalSessions: [''],
      treatmentDetailDTOs: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    if (this.storedUserSession !== null) {
      this.userSession = JSON.parse(this.storedUserSession);
      this.byName = this.userSession.user.name;
    } // kiểm tra lấy tên tài khoản

    // gọi hàm lấy danh sách dịch vụ
    this.initService();

    this.initTreatmentById();
  }

  private initTreatmentById() {
    if (this.treatmentId) {
      this.sharesApi
        .getTreatmentDetail(this.treatmentId)
        .subscribe((data: any) => {
          // Patch simple form controls
          this.treatmentForm.patchValue({
            treatmentName: data.treatmentName,
            totalSessions: data.totalSessions,
          });
        });
    }
  }

  getValueFromSelect(value: TDSSafeAny) {
    const val = {
      serviceID: value.value.serviceID,
      serviceName: value.value.serviceName,
      unitPrice: value.value.price,
      quantity: 1,
      tempPrice: value.value.price,
      price: value.value.price,
      amountDiscount: 0,
      kindofDiscount: '%',
    }
    this.addPushData(val);
  }

  //
  onClearAll(event: MouseEvent) {
    event.stopPropagation();
    this.inputValue = "";
    this.listSearch = this.listService
  }

  // Kiểm tra trước khi push
  private addPushData(value: any) {
    this.listOfData = [...this.listOfData || [], value];
    this.resetTotal();
    console.log(this.listOfData)
  }

  delete(index: number) {
    this.listOfData = this.listOfData.slice(0, index).concat(this.listOfData.slice(index + 1));
    this.resetTotal();
  }

  //Tính lại tổng tiền
  resetTotal() {
    this.total = 0;
    for (const num of this.listOfData) {
      this.total += num.price;
    }
  }

  // Calculate Total Price
  totalPrice(id: number) {
    const service = this.listOfData.find((ser) => ser.serviceID === id);
    service.tempPrice = service.unitPrice * service.quantity;
    this.priceAfterDiscount(id);
  }

  // Calculate the price after use discount
  priceAfterDiscount(id: number) {
    const service = this.listOfData.find((ser) => ser.serviceID === id);
    if (service.kindofDiscount == '%') {
      service.price =
        (service.tempPrice * (100 - service.amountDiscount)) / 100;
    } else {
      service.price = service.tempPrice - service.amountDiscount;
    }
    this.resetTotal();
  }

  //
  activeDiscountPercentagePrice(id: number) {
    const service = this.listOfData.find((ser) => ser.serviceID === id);
    service.kindofDiscount = '%';
    service.amountDiscount = 0;
    service.price = service.tempPrice;
    this.resetTotal();
  }

  //
  activeDiscountVNDPrice(id: number) {
    const service = this.listOfData.find((ser) => ser.serviceID === id);
    service.kindofDiscount = 'VND';
    service.amountDiscount = 0;
    service.price = service.tempPrice;
    this.resetTotal();
  }

  onChangeAutocomplete(data: any): void {
    console.log(data.data);
    this.sharesApi.searchService(data.data).subscribe(
      (res: any) => {
        // console.log(res.service)
        this.listSearch = res.services
        // console.log(this.listSearch)
      }
    )
  }



  // lấy danh sách dịch vụ
  initService() {
    this.sharesApi.renderListService().subscribe((data: any) => {
      this.listSearch = this.listService = data.serviceDTO;
    });
  }
  enter() {
    if (this.treatmentForm.invalid) return;
    if (this.treatmentForm.value) {
      const val = this.treatmentForm.value;
      const body: any = {
        ...val,
        createBy: this.userSession.user.name,
        customerID: this.customerId,
        treatmentDetailDTOs: this.listOfData
      };
      if (this.treatmentId) {
        this.updateTreatment(this.treatmentId, body);
      } else {
        this.add(body);
      }
    }
  }

  add(body: any) {
    this.sharesApi.addTreatmentPlan(body).subscribe({
      next: (res) => {
        this.createNotificationSuccess('Thành công');
        this.modalRef.destroy(res);
      },
      error: (res) => {
        this.createNotificationError(res.error.message);
      },
    });
  }

  updateTreatment(id: number, body: any) {
    this.sharesApi.updateTreatmentPlan(id, body).subscribe({
      next: (res) => {
        this.createNotificationSuccess('Thành công');
        this.modalRef.destroy(res);
      },
      error: (res) => {
        this.createNotificationError(res.error.message);
      },
    });
  }

  // Success Notification
  createNotificationSuccess(content: any): void {
    this.notification.success('', content);
  }

  // Error Notification
  createNotificationError(content: any): void {
    this.notification.error('', content);
  }

  onChange(e: TDSSafeAny) {
    const total = this.totalService;
    this.totalService = total * e;
  }
}
