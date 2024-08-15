import { Component, ElementRef, inject, Input, OnInit } from '@angular/core';
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
import { catchError, EMPTY, iif, tap } from 'rxjs';
import { TDSFormField } from 'tds-ui/form-field';

@Component({
  selector: 'frontend-modal-treatment-plan',
  templateUrl: './modal-treatment-plan.component.html',
  styleUrls: ['./modal-treatment-plan.component.scss'],
})
export class ModalTreatmentPlanComponent implements OnInit {
  private readonly modalRef = inject(TDSModalRef);

  @Input() customerId?: number;
  @Input() treatmentId?: number;

  // treatmentForm: FormGroup;

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
  quantity?: number;

  userSession: any;
  storedUserSession = localStorage.getItem('userSession');

  sessionFormGroup: any;
  options: TDSSafeAny;

  customerID: any;
  startDate: any;
  createBy: any;
  notes: any;
  treatmentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private sharesApi: AuthService,
    private notification: TDSNotificationService
  ) {
    this.treatmentForm = this.fb.group({
      customerID: [''],
      startDate: format(new Date(), DATE_CONFIG.DATE_BASE),
      createBy: [''],
      note: [''],
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
  initTreatmentById() {
    if (this.treatmentId) {
      this.sharesApi
        .getTreatmentDetail(this.treatmentId)
        .subscribe((data: any) => {
          this.treatmentForm.patchValue({
            customerID: data.customerID,
            startDate: data.startDate,
            createBy: data.createBy,
            note: data.note,
          });

          data.treatmentDetails.forEach((item: any) => {
            this.addItem(item);
          });
        });
    }
  }

  get treatmentDetailDTOs(): FormArray {
    return this.treatmentForm.get('treatmentDetailDTOs') as FormArray;
  }

  addItem(value: TDSSafeAny) {
    const priceCurrent = value.service.price
    this.sessionFormGroup = this.fb.group({
      serviceID: [value.serviceID],
      serviceName: [value.serviceName?value.serviceName: value.service.serviceName],
      unitPrice: [value.price? value.price: priceCurrent],
      quantity: [value.quantity? value.quantity: 1],
      tempPrice: [value.price ?value.price: priceCurrent],
      price: [value.price? value.price: priceCurrent],
      amountDiscount: [value.amountDiscount? value.amountDiscount: 0],
      kindofDiscount: [value.kindofDiscount? value.kindofDiscount:'%'],
    });
    this.treatmentDetailDTOs.push(this.sessionFormGroup);
    this.resetTotal();
  }

  onClearAll(event: MouseEvent) {
    event.stopPropagation();
    this.inputValue = '';
    this.listSearch = this.listService;
  }

  //Tính lại tổng tiền
  resetTotal() {
    this.total = 0;
    for (const num of this.treatmentDetailDTOs.value) {
      this.total += num.price;
    }
  }

  // Calculate Total Price
  price(id: number) {
    const service = this.treatmentDetailDTOs.value.find(
      (ser: any) => ser.serviceID === id
    );
    service.tempPrice = service.unitPrice * service.quantity;
    this.priceAfterDiscount(id);
  }

  // Calculate the price after use discount
  priceAfterDiscount(id: number) {
    const service = this.treatmentDetailDTOs.value.find(
      (ser: any) => ser.serviceID === id
    );
    if (service.kindofDiscount == '%') {
      service.price =
        (service.tempPrice * (100 - service.amountDiscount)) / 100;
    } else {
      service.price = service.tempPrice - service.amountDiscount;
    }
    this.resetTotal();
  }

  // Lấy id và loại giảm giá % hoặc VND
  updateTypeDiscount(index: number, type: string) {
    const serviceCur = this.treatmentDetailDTOs.controls[index];
    serviceCur.patchValue({
      amountDiscount: 0,
      kindofDiscount: type,
    });
    this.resetTotal();
  }

  // Xóa 1 item ra khỏi formArray
  delete(index: number) {
    this.treatmentDetailDTOs.removeAt(index);
    this.resetTotal();
  }

  onChangeAutocomplete(data: any): void {
    this.sharesApi.searchService(data.data).subscribe((res: any) => {
      this.listSearch = res.services;
    });
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
      };
      this.submit$(this.treatmentId as number, body).subscribe();
    }
  }

  add(body: any) {
    this.sharesApi.addTreatmentPlan(body).subscribe({
      next: (res) => {
        this.createNotificationSuccess('Thành công');
        this.modalRef.destroy(res || true);
      },
      error: (res) => {
        this.createNotificationError(res.error.message);
      },
    });
  }

  updateTreatment(id: number, body: any) {
    return this.sharesApi.updateTreatmentPlan(id, body).subscribe({
      next: (res) => {
        this.createNotificationSuccess('Thành công');
        this.modalRef.destroy(res || true);
      },
      error: (res) => {
        this.createNotificationError(res.error.message);
      },
    });
  }

  submit$(id: number, body: any) {
    return iif(
      () => id === undefined,
      this.sharesApi.addTreatmentPlan(body),
      this.sharesApi.updateTreatmentPlan(id, body)
    ).pipe(
      tap((res) => {
        this.createNotificationSuccess('Thành công');
        this.modalRef.destroy(res || true);
      }),
      catchError((res) => {
        this.createNotificationError(res.error.message);
        return EMPTY;
      })
    );
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
