import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSDatePickerModule } from 'tds-ui/date-picker';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSModalModule, TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSRadioModule } from 'tds-ui/radio';
import { TDSSelectModule } from 'tds-ui/select';
import { TDSInputModule } from 'tds-ui/tds-input';
import { AuthService } from '../../../shared.service';
import { TDSNotificationService } from 'tds-ui/notification';
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;

@Component({
  selector: 'frontend-admin-modal',
  standalone: true,
  imports: [
    TDSDatePickerModule,
    CommonModule,
    TDSFormFieldModule,
    ReactiveFormsModule,
    TDSModalModule,
    TDSInputModule,
    TDSButtonModule,
    TDSSelectModule,
    TDSRadioModule,
    FormsModule
  ],
  templateUrl: './admin-modal.component.html',
  styleUrls: ['./admin-modal.component.scss'],
})
export class AdminModalComponent implements OnInit{
  private readonly tModalSvc =inject(TDSModalService)
  private readonly modalRef = inject(TDSModalRef);
  @Input() email?: string;
  @Input() role?: string;
  @Input() isActive?: boolean;
  checkDislay?: boolean = true
  createAdmin = inject(FormBuilder).nonNullable.group({
    lastName: ['', Validators.required],
    firstName: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^[0]{1}[0-9]{9}$/)]],
    email: [
      '',
      Validators.compose([
        Validators.required,
        Validators.email
      ])
    ],
    password: [
      '',
      Validators.compose([
        Validators.minLength(8),
        Validators.pattern(PASSWORD_PATTERN)
      ])
    ],
    confirmPassword: [
      '',
      Validators.compose([
        this.matchValidator.bind(this)
      ])
    ],
    userName: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    gender: ['Nam', Validators.required], 
 });

  readonly genderOptions = [{
    id: "Nam", name: 'Nam'},
  { id: "Nữ", name: 'Nữ' },]

  branchOptions: any[] = [];
  jobTypeOptions: any[] = [];

  constructor(
    private shared: AuthService,
    private notification: TDSNotificationService
  ) {}

  matchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (!this.createAdmin) {
      return {mustMatch:false};
    }

    const pass = this.createAdmin.value.password;
    const retype = control.value;

    if (pass !== retype) {
      return { mustMatch: false };
    }

    return null;
  }

  ngOnInit(): void {

    this.shared.getBranch().subscribe(
      (data: any[]) => {
        this.branchOptions = [...data.map(item => ({
          id: item.branchID,
          name: item.branchName,
        }))]
      })

    this.shared.getJobType().subscribe(
      (data: any[]) => {
        this.jobTypeOptions = [...data.map(item => ({
          id: item.jobTypeID,
          name: item.jobTypeName,
        }))]
      })

      if(this.email) {
        this.checkDislay = false
        if(this.role==='Quản lý'){
          this.shared.getAdminByEmail(this.email).subscribe(
            (data: any) => {
              this.createAdmin.patchValue({
               lastName: data.adminDTO.lastName,
               firstName: data.adminDTO.firstName,
               email: data.adminDTO.email,
               userName:data.adminDTO.userName,
               password: data.adminDTO.password,
               confirmPassword: data.adminDTO.confirmPassword,
               phone: data.adminDTO.phone,
               gender: data.adminDTO.gender,
               dateOfBirth: data.adminDTO.dateOfBirth,
              })
            }
          )
        }
    }
  }

  handleOk(): void {
    this.modalRef.destroy(true)
  }

  handleCancel(): void {
    this.modalRef.destroy(false)
  }
  submit() {
    if (this.createAdmin.invalid) {
      this.markFormGroupTouched(this.createAdmin);
      return;
    }
    const val = {
      ...this.createAdmin.value,
    };
    if (this.email) {
      this.updateUser(this.email, val);
    } else {
      this.onSignUp();
    }
  }
  updateUser(email: string, val: any) {
    this.shared.editUser(email, val).subscribe({
      next: () => {
        this.createNotificationSuccess('');
        this.modalRef.destroy(val);
      },
      error: (res) => {
        this.createNotificationError(res.error.message);
      },
    });
  }
  createNotificationSuccess(content: any): void {
    this.notification.success('Thành công!', content);
  }
  createNotificationError(content: any): void {
    this.notification.error('Thất bại!', content);
  }
  onSignUp(): void {
    const lastName = this.createAdmin.value.lastName as string;
    const firstName = this.createAdmin.value.firstName as string;
    const phone = this.createAdmin.value.phone as string;
    const email = this.createAdmin.value.email as string;
    const userName = this.createAdmin.value.userName as string;
    const password = this.createAdmin.value.password as string;
    const confirmPassword = this.createAdmin.value.confirmPassword as string;
    const dateOfBirth = this.createAdmin.value.dateOfBirth as string;
    const gender = this.createAdmin.value.gender as string;

    this.shared.createAdmin(lastName, firstName, gender, phone, email,userName, password,
       confirmPassword, dateOfBirth)
       .subscribe((result) => {
      if (result.status != null) {
         const modal = this.tModalSvc.success({
          title:'Thành công',
          content: `<h5 class="text-success-500">Tạo tài khoản <strong>${ email }</strong> thành công!</h5>`,
          footer:null,
          size:'md',
          okText:'Xác nhận',
          onOk:()=> true
        });
        modal.afterClose.asObservable()
        //.pipe(tap(()=>this.createUser.reset({
          // branchID:0,
          // dateOfBirth:'',
          // email:'',
          // firstName:'',
          // gender:'',
          // hireDate:'',
          // jobTypeID:0,
          // lastName:'',
          // phone:'',
          // role:'',
          // password:'',
          // confirmPassword:'',
        //})))
        .subscribe(() =>this.modalRef.close());
      }
      else{
         const modal = this.tModalSvc.error({
          title:'Thất bại',
          content: `<h5 class="text-error-500">Tạo tài khoản <strong>${ email }</strong> thất bại! Tài khoản đã tồn tại hoặc đã xảy ra lỗi!</h5>`,
          footer:null,
          size:'md',
          okText:'Xác nhận',
          onOk:()=> true
        });
        modal.afterClose.asObservable()
        .subscribe
        (res=>{
          if(res){
            this.createAdmin;
          }
        });
      }
    });
  }
  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if ((control as FormGroup)?.controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}
