import { Component, inject, Input, OnInit, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TDSModalModule, TDSModalRef } from 'tds-ui/modal';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSDatePickerModule } from 'tds-ui/date-picker';
import { TDSButtonModule } from 'tds-ui/button';
import { AuthService } from '../../../shared.service';
import { TDSSelectModule } from 'tds-ui/select';
import { TDSModalService } from 'tds-ui/modal';
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
  private auth = inject(AuthService);
  private readonly modalRef = inject(TDSModalRef);
  @Input() email?: string;
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
    pass: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(PASSWORD_PATTERN)
      ])
    ],
    retype: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(PASSWORD_PATTERN),
        this.matchValidator.bind(this)
      ])
    ],
    dateOfBirth: ['', Validators.required],
    hireDate: ['', Validators.required],
    gender: ['Male', Validators.required],
    role: ['Employee', Validators.required],
    jobTypeID: ['', Validators.required],
    branchID: ['', Validators.required],

  });
  // createAccountForEmployee = inject(FormBuilder).nonNullable.group({
  //   email: [
  //     '',
  //     Validators.compose([
  //       Validators.required,
  //       Validators.email
  //     ])
  //   ],
  //   pass: [
  //     '',
  //     Validators.compose([
  //       Validators.required,
  //       Validators.minLength(8),
  //       Validators.pattern(PASSWORD_PATTERN)
  //     ])
  //   ],
  //   retype: [
  //     '',
  //     Validators.compose([
  //       Validators.required,
  //       Validators.minLength(8),
  //       Validators.pattern(PASSWORD_PATTERN),
  //       this.matchValidator.bind(this)
  //     ])
  //   ],
  // });

  readonly roleOptions = [{
    id: "Admin", name: ' Admin '
  },
  { id: "Employee", name: 'Employee' },]

  readonly jobTypeOptions = [{
    id: 1, name: ' Rua Chen'
  },
  { id: 2, name: 'Nau Com' },]

  readonly branchOptions = [{
    id: 1, name: ' Viet Nam'
  },
  { id: 2, name: 'Thai Lan' },]

  readonly genderOptions = [{
    id: "Male", name: ' Male '
  },
  { id: "Female", name: 'Female' },]

  matchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (!this.createUser) {
      return null;
    }

    const pass = this.createUser.value.pass;
    const retype = control.value;

    if (pass !== retype) {
      return { mustMatch: true };
    }

    return null;
  }

  ngOnInit(): void {
    console.log(this.email)
    console.log(this.createUser.value.email)
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.modalRef.destroy(true)
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.modalRef.destroy(false)
  }

  onSignUp(): void {
    const lastName = this.createUser.value.lastName as string;
    const firstName = this.createUser.value.firstName as string;
    const phone = this.createUser.value.phone as string;
    const email = this.createUser.value.email as string;
    const password = this.createUser.value.pass as string;
    const confirmPassword = this.createUser.value.retype as string;
    const dateOfBirth = this.createUser.value.dateOfBirth as string;
    const hireDate = this.createUser.value.hireDate as string;
    const gender = this.createUser.value.gender as string;
    const jobTypeID = this.createUser.value.jobTypeID as string;
    const branchID = this.createUser.value.branchID as string;
    const role = this.createUser.value.role as string;

    if (this.createUser.invalid) {
      this.markFormGroupTouched(this.createUser);
      //console.log(this.createUser.value);
      return;
    }
    // Thực hiện các hành động khi form hợp lệ
    this.auth.signUp(lastName, firstName, gender, phone, email, password, confirmPassword, dateOfBirth, hireDate, jobTypeID, branchID, role).subscribe((result) => {
      //console.log(result)
      if (result.status != null) {
        console.log(result.status)
          this.createUser.reset();
          
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
