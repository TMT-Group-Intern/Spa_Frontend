import { Component, inject, Input, OnInit, } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TDSModalModule, TDSModalRef } from 'tds-ui/modal';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSDatePickerModule } from 'tds-ui/date-picker';
import { TDSButtonModule } from 'tds-ui/button';
import { AuthService } from '../../../shared.service';
import { TDSSelectModule } from 'tds-ui/select';
import { TDSModalService } from 'tds-ui/modal';
import { concatMap, filter, tap } from 'rxjs';
import { TDSNotificationService } from 'tds-ui/notification';
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;


@Component({
  selector: 'frontend-users-modal',
  standalone: true,
  imports: [TDSDatePickerModule, CommonModule, TDSFormFieldModule, ReactiveFormsModule, TDSModalModule, TDSInputModule, TDSButtonModule, TDSSelectModule],
  templateUrl: './users-modal.component.html',
  styleUrls: ['./users-modal.component.scss'],
})

export class UsersModalComponent implements OnInit {
  
  private readonly tModalSvc =inject(TDSModalService)
  private readonly modalRef = inject(TDSModalRef);
  @Input() email?: string;
  @Input() role?: string;
  @Input() isActive?: boolean;
  checkDislay?: boolean = true
  createUser = inject(FormBuilder).nonNullable.group({
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

    dateOfBirth: ['', Validators.required],
    hireDate: [new Date().toISOString()],
    gender: ['Male', Validators.required],
    role: ['Employee', Validators.required],
    jobTypeID: [0],
    branchID: [0],
 });
  
  

  readonly roleOptions = [{
    id: "Admin", name: 'Admin'},
  { id: "Employee", name: 'Employee' },]

  readonly genderOptions = [{
    id: "Male", name: 'Male'},
  { id: "Female", name: 'Female' },]

  branchOptions: any[] = [];
  jobTypeOptions: any[] = [];

  constructor(
    private shared: AuthService,
    private notification: TDSNotificationService
  ) {}

  matchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (!this.createUser) {
      return {mustMatch:false};
    }

    const pass = this.createUser.value.password;
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
        // this.createUser.get('email')?.disable()
        // this.createUser.get('role')?.disable()
        console.log(this.createUser.get('role'))
        console.log(this.isActive)
        if(this.role==='Admin'){
          console.log(this.role)
          this.shared.getAdminByEmail(this.email).subscribe(
            (data: any) => {
              this.createUser.patchValue({
               role: 'Admin',
               lastName: data.adminDTO.lastName,
               firstName: data.adminDTO.firstName,
               email: data.adminDTO.email,
               password: data.adminDTO.password,
               confirmPassword: data.adminDTO.confirmPassword,
               phone: data.adminDTO.phone,
               gender: data.adminDTO.gender,
               dateOfBirth: data.adminDTO.dateOfBirth,
              })
              console.log(data)
            }
          )
        }
      else if(this.role !=='Admin'){
        console.log(this.role)
        //this.checkDislay = false
        this.shared.getEmployeeByEmail(this.email).subscribe(
          (data: any) => {
            this.createUser.patchValue({
             role: 'Employee',
             lastName: data.empDTO.lastName,
             firstName: data.empDTO.firstName,
             email: data.empDTO.email,
             phone: data.empDTO.phone,
             gender: data.empDTO.gender,
             dateOfBirth: data.empDTO.dateOfBirth,
             hireDate: new Date(data.empDTO.hireDate).toISOString(),
             jobTypeID: data.empDTO.jobTypeID,
             branchID: data.empDTO.branchID,
            })
            console.log(data)
          }
        )
      }
    }
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.modalRef.destroy(true)
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.modalRef.destroy(false)
  }
  submit() {
    if (this.createUser.invalid) {
      this.markFormGroupTouched(this.createUser);
      console.log(this.createUser.value);
      return;
    } 
    const val = {
      ...this.createUser.value,
    };
    console.log(val)

    if (this.email) {
     
      this.updateUser(this.email, val);
      console.log(val)
      console.log(val.role)
    } else {
      this.onSignUp();
    }
  }
  updateUser(email: string, val: any) {
    console.log(val)
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
    this.notification.success('Succesfully', content);
  }

  // Error Notification
  createNotificationError(content: any): void {
    this.notification.error('Error', content);
  }
  onSignUp(): void {
    // if(this.createUser.value.role ==='Employee'){
    //   this.createUser.value.pass='';
    //   this.createUser.value.retype='';
    // }
    if(this.role ==='Admin'){
      this.createUser.value.branchID=0;
      this.createUser.value.jobTypeID=0;
      this.createUser.value.hireDate='';
    }
    const lastName = this.createUser.value.lastName as string;
    const firstName = this.createUser.value.firstName as string;
    const phone = this.createUser.value.phone as string;
    const email = this.createUser.value.email as string;
    //const role = this.role as string;
    const role = this.createUser.value.role as string;
    const password = this.createUser.value.password as string;
    const confirmPassword = this.createUser.value.confirmPassword as string;
    const dateOfBirth = this.createUser.value.dateOfBirth as string;
    const hireDate = this.createUser.value.hireDate as string;
    const gender = this.createUser.value.gender as string;
    const jobTypeID = this.createUser.value.jobTypeID as number;
    const branchID = this.createUser.value.branchID as number;

    // if (this.createUser.invalid) {
    //   this.markFormGroupTouched(this.createUser);
    //   console.log(this.createUser.value);
    //   return;
    // }

    console.log(this.createUser)
    // Thực hiện các hành động khi form hợp lệ
    this.shared.signUp(lastName, firstName, gender, phone, email, password, confirmPassword, dateOfBirth, hireDate, jobTypeID, branchID, role).subscribe((result) => {
      //console.log(result)
      if (result.status != null) { 
         console.log(result.status)
         //this.createUser.reset();

         const modal = this.tModalSvc.create({
          title:'Thành công',
          content: `<h5 class="text-success-500">Tạo tài khoản <strong>${ email }</strong> thành công!</h5>`,
          footer:null,
          size:'md',
          okText:'Xác nhận',
          onOk:()=> true
        });
        modal.afterClose.asObservable()
        // .pipe(tap(()=>this.createUser.reset({
        //   branchID:0,
        //   dateOfBirth:'',
        //   email:'',
        //   firstName:'',
        //   gender:'',
        //   hireDate:'',
        //   jobTypeID:0,
        //   lastName:'',
        //   phone:'',
        //   role:'',
        //   pass:'',
        //   retype:''
        // })))
        .subscribe();
      }
      else{
        console.log(this.createUser.value)
        console.log(this.role)
        console.log(result.status)
         //this.createUser.reset();

         const modal = this.tModalSvc.create({
          title:'Thất bại',
          content: `<h5 class="text-error-500">Tạo tài khoản <strong>${ email }</strong> thất bại! Tài khoản đã tồn tại hoặc đã xảy ra lỗi!</h5>`,
          footer:null,
          size:'lg',
          okText:'Xác nhận',
          onOk:()=> true
        });
        modal.afterClose.asObservable()
        .subscribe
        (res=>{
          if(res){
            this.createUser;
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
