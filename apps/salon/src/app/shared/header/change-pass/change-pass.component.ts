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
  selector: 'frontend-change-pass',
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
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.scss'],
})
export class ChangePassComponent implements OnInit {
  private readonly tModalSvc = inject(TDSModalService)
  private readonly modalRef = inject(TDSModalRef);
  checkDislay?: boolean = true
  userSession: any;
  userName: any;
  changePassword = inject(FormBuilder).nonNullable.group({
    oldPassword: [
      '',
      Validators.compose([
        Validators.required,
        Validators.pattern(PASSWORD_PATTERN)
      ])
    ],
    password: [
      '',
      Validators.compose([
        Validators.required,
        Validators.pattern(PASSWORD_PATTERN)
      ])
    ],
    confirmPassword: [''],
  });
  mustMatch = true

  constructor(
    private shared: AuthService,
    private notification: TDSNotificationService,
  ) { }

  matchValidator() {
    if (this.changePassword.value.password == this.changePassword.value.confirmPassword) {
      this.mustMatch = true
    } else {
      this.mustMatch = false
    }
  }

  // matchValidator(control: AbstractControl): { [key: string]: boolean } | null {
  //   if (!this.changePassword) {
  //     return {mustMatch:false};
  //   }

  //   const pass = this.changePassword.value.password;
  //   const retype = control.value;

  //   if (pass !== retype) {
  //     return { mustMatch: false };
  //   }

  //   return null;
  // }

  ngOnInit(): void {
    const storedUserSession = localStorage.getItem('userSession');
    if (storedUserSession !== null) {
      this.userSession = JSON.parse(storedUserSession);
    }
    this.userName = this.userSession.user.userName;
  }

  handleOk(): void {
    this.modalRef.destroy(true)
  }

  handleCancel(): void {
    this.modalRef.destroy(false)
  }
  submit() {
    if (this.changePassword.invalid) return;

    this.matchValidator()
    if (!this.mustMatch) return;

    const val = {
      ...this.changePassword.value,
    };
    this.onChangePassword();
  }

  createNotificationSuccess(content: any): void {
    this.notification.success('Thành công!', content);
  }
  createNotificationError(content: any): void {
    this.notification.error('Thất bại!', content);
  }
  onChangePassword(): void {
    const userName = this.userName as string;
    const oldPassword = this.changePassword.value.oldPassword as string;
    const password = this.changePassword.value.password as string;
    const confirmPassword = this.changePassword.value.confirmPassword as string;

    this.shared.changePassword(userName, oldPassword, password, confirmPassword)
      .subscribe((result) => {
        if (result.flag == true) {
          const modal = this.tModalSvc.success({
            title: 'Thành công',
            content: `<h5 class="text-success-500">Đổi mật khẩu thành công!</h5>`,
            footer: null,
            size: 'md',
            okText: 'Xác nhận',
            onOk: () => true
          });
          modal.afterClose.asObservable().subscribe(() => this.modalRef.close());
        }
        else {
          const modal = this.tModalSvc.error({
            title: 'Thất bại',
            content: `<h5 class="text-error-500">${result.message}</h5>`,
            footer: null,
            size: 'md',
            okText: 'Xác nhận',
            onOk: () => true
          });
          modal.afterClose.asObservable()
            .subscribe
            (res => {
              if (res) {
                this.changePassword;
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
