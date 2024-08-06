import { Component, inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { DATE_CONFIG } from '../../../core/enums/date-format.enum';
import { AuthService } from '../../../shared.service';
import { TDSNotificationService } from 'tds-ui/notification';

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
    { id: 10, name: '10 buổi'}
  ]

  private readonly sharesApi = inject(AuthService)
  private readonly notification = inject(TDSNotificationService)
  form: FormGroup;
  @Input() customerId?: number;

  selectSessionOptions = 1

  sessionChosen: number[] = [];
  byName = '';
  listService: any;

  userSession: any;
  storedUserSession = localStorage.getItem('userSession');

 sessionFormGroup :any;


  constructor(
    private fb: FormBuilder
  ){
    this.form = this.fb.group({
      treatmentName: ['', Validators.required],
      customerID: [''],
      startDate: format(new Date(),DATE_CONFIG.DATE_BASE),
      createBy: [''],
      note: [''],
      totalSessions:[''],
      treatmentSessionsDTO: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    if (this.storedUserSession !== null) {
      this.userSession = JSON.parse(this.storedUserSession);
      this.byName = this.userSession.user.name;
      console.log(this.byName);
    }// kiểm tra lấy tên tài khoản

   this.form.get('totalSessions')?.valueChanges.subscribe(data => {
    this.sessionChosen = Array( data as unknown as number).fill(0).map((x, i) => i + 1);
    // this.addSessions(data);
    this.updateSessions(data);
  });// Lấy value id

  // gọi hàm lấy danh sách dịch vụ
  this.initService();
  }

  get treatmentSessionsDTO(): FormArray {
    return this.form.get('treatmentSessionsDTO') as FormArray;
  }

  addSession(key: number) {
     this.sessionFormGroup = this.fb.group({
      sessionNumber: [key],
      treatmendSessionDetailDTO:[
      ]
    });
    this.treatmentSessionsDTO.push(this.sessionFormGroup);
  }

  updateSessions(totalSessions: number): void {
    const currentSessions = this.treatmentSessionsDTO.length;
    if (totalSessions > currentSessions) {
      for (let i = currentSessions + 1; i <= totalSessions; i++) {
        this.addSession(i);
      }
    } else if (totalSessions < currentSessions) {
      for (let i = currentSessions; i > totalSessions; i--) {
        this.treatmentSessionsDTO.removeAt(i - 1);
      }
    }
  }
  // lấy danh sách dịch vụ
  initService(){
    this.sharesApi.renderListService().subscribe((data: any)=> {
      this.listService = data.serviceDTO;
    })
  }
  submit(){
    if(this.form.invalid) return;

    if(this.form.value){
      const val = this.form.value;
      const body: any ={
        ...val,
        createBy: this.userSession.user.name,
        customerID: this.customerId,
      }
      console.log(body);
      this.add(body);
    }
  }

  add(body: any){
    this.sharesApi.addTreatmentPlan(body).subscribe(
      {
        next:() => {
          this.createNotificationSuccess('Thành công');
        },
        error:(res) => {
          this.createNotificationError(res.error.message);
        }
      }
  )
  }

    // Success Notification
    createNotificationSuccess(content: any): void {
      this.notification.success(
        '', content
      );
    }

    // Error Notification
    createNotificationError(content: any): void {
      this.notification.error(
        '', content
      );
    }
}
