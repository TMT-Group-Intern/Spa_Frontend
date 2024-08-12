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
  public sessionOptions = [
    { id: 1, name: '1 buổi' },
    { id: 2, name: '2 buổi' },
    { id: 3, name: '3 buổi' },
    { id: 4, name: '4 buổi' },
    { id: 5, name: '5 buổi' },
    { id: 6, name: '5 buổi' },
    { id: 7, name: '7 buổi' },
    { id: 8, name: '8 buổi' },
    { id: 9, name: '9 buổi' },
    { id: 10, name: '10 buổi' },
  ];

  private readonly sharesApi = inject(AuthService);
  private readonly notification = inject(TDSNotificationService);
  private readonly modalRef = inject(TDSModalRef);

  @Input() customerId?: number;
  @Input() treatmentId?: number;

  form: FormGroup;

  selectSessionOptions = 1;
  public listSelected = [];
  byName = '';
  number = 1;
  totalService = 0;
  numberValue = 1;
  totalDiscount = 0;
  total = 0;

  sessionChosen: number[] = [];
  listService: any;
  listOfData: any[] = [];

  userSession: any;
  storedUserSession = localStorage.getItem('userSession');

  sessionFormGroup: any;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      treatmentName: ['', Validators.required],
      customerID: [''],
      startDate: format(new Date(), DATE_CONFIG.DATE_BASE),
      createBy: [''],
      note: [''],
      service: [],
      totalSessions: [''],
      treatmentSessionsDTO: this.fb.array([]),
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
          this.form.patchValue({
            treatmentName: data.treatmentName,
            totalSessions: data.totalSessions,
          });

          // Clear existing FormArray
          this.treatmentSessionsDTO.clear();

          // Add new form groups to the FormArray
          data.treatmentSessions.forEach((session: any) => {
            this.addItemToTreatmentSession(session);
          });
        });
    }
  }

  getValueFromSelect(value: TDSSafeAny) {
    const val =  {
        serviceID: value.serviceID,
        serviceName: value.serviceName,
        unitPrice: value.price,
        quantity: 1,
        tempPrice: value.price,
        totalPrice: value.price,
        amountDiscount: 0,
        kindofDiscount: '%',
      }
    this.addPushData(val);
  }

  // Kiểm tra trước khi push
  private addPushData(value: any) {
    const itemDub = this.listOfData?.find(item => item.serviceID === value.serviceID);
    if(itemDub){
      this.createNotificationError('Dịch vụ đã tồn tại!');
    }else{
      this.listOfData = [...this.listOfData||[], value];
    }
    this.resetTotal();
  }

  //
  resetTotal() {
    this.total = 0;
    for (const num of this.listOfData) {
      this.total += num.totalPrice;
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
      service.totalPrice =
        (service.tempPrice * (100 - service.amountDiscount)) / 100;
    } else {
      service.totalPrice = service.tempPrice - service.amountDiscount;
    }
    this.resetTotal();
  }

  //
  activeDiscountPercentagePrice(id: number) {
    const service = this.listOfData.find((ser) => ser.serviceID === id);
    service.kindofDiscount = '%';
    service.amountDiscount = 0;
    service.totalPrice = service.tempPrice;
    this.resetTotal();
  }

  //
  activeDiscountVNDPrice(id: number) {
    const service = this.listOfData.find((ser) => ser.serviceID === id);
    service.kindofDiscount = 'VND';
    service.amountDiscount = 0;
    service.totalPrice = service.tempPrice;
    this.resetTotal();
  }

  private addItemToTreatmentSession(session: any) {
    const treatmentSessionForm = this.fb.group({
      sessionNumber: [session.sessionNumber],
      treatmendSessionDetailDTO: [session.treatmendSessionDetail],
    });
    this.treatmentSessionsDTO.push(treatmentSessionForm);
  }

  get treatmentSessionsDTO(): FormArray {
    return this.form.get('treatmentSessionsDTO') as FormArray;
  }
  addSession() {
    this.sessionFormGroup = this.fb.group({
      sessionNumber: [1],
      treatmendSessionDetailDTO: [],
    });
    this.treatmentSessionsDTO.push(this.sessionFormGroup);
  }

  //xóa vị trí đã chọn
  deleteSession(key: number) {
    this.treatmentSessionsDTO.removeAt(key);
  }

  // lấy danh sách dịch vụ
  initService() {
    this.sharesApi.renderListService().subscribe((data: any) => {
      this.listService = data.serviceDTO;
    });
  }
  submit() {
    if (this.form.invalid) return;
    if (this.form.value) {
      const val = this.form.value;
      const body: any = {
        ...val,
        createBy: this.userSession.user.name,
        customerID: this.customerId,
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
