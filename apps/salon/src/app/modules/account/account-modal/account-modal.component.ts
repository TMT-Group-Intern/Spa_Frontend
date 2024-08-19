import { Component, inject, Input, OnInit, } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TDSModalModule, TDSModalRef } from 'tds-ui/modal';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSDatePickerModule } from 'tds-ui/date-picker';
import { TDSButtonModule } from 'tds-ui/button';
import { AuthService } from '../../../shared.service';
import { TDSSelectModule } from 'tds-ui/select';
import { TDSModalService } from 'tds-ui/modal';
import { concatMap, filter, tap } from 'rxjs';
import { TDSNotificationService } from 'tds-ui/notification';
import { TDSRadioModule } from 'tds-ui/radio';
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;


@Component({
  selector: 'frontend-account-modal',
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
    TDSRadioModule, FormsModule
  ],
  templateUrl: './account-modal.component.html',
  styleUrls: ['./account-modal.component.scss'],
})

export class AccountModalComponent implements OnInit {

  private readonly tModalSvc = inject(TDSModalService)
  private readonly modalRef = inject(TDSModalRef);
  @Input() email?: string;
  @Input() role?: string;
  @Input() isActive?: boolean;
  @Input() userName?: string;
  @Input() id?: string;
  @Input() lastName?: string;
  @Input() firstName?: string;
  employeeOptions: any[] = []
  branchId?: number;
  userSession: any;
  storedUserSession = localStorage.getItem('userSession');
  createAccount = inject(FormBuilder).nonNullable.group({
    userName: [
      '',
      Validators.compose([
        Validators.required,
      ])
    ],
    password: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(PASSWORD_PATTERN)
      ])
    ],
    confirmPassword: [
      '',
      Validators.compose([
        Validators.required,
        this.matchValidator.bind(this)
      ])
    ],
    employee: [
      '',
    ],
  });

  constructor(
    private shared: AuthService,
    private notification: TDSNotificationService
  ) { }

  matchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (!this.createAccount) {
      return { mustMatch: true };
    }
    const pass = this.createAccount.value.password;
    const retype = control.value;

    if (pass !== retype) {
      return { mustMatch: true };
    }
    return null;
  }

  ngOnInit(): void {
    if (this.storedUserSession !== null) {
      this.userSession = JSON.parse(this.storedUserSession);
      this.branchId = this.userSession.user.branchID;
    }
    this.shared.getAllEmployee().subscribe(
      (data: any[]) => {
        this.employeeOptions = [...data.map(item => ({
          id: item.employeeID,
          name: `${item.lastName} ${item.firstName}`
        }))]
      })
    if (this.id) {
      //this.checkDislay = false
      this.shared.getUserByUserID(this.id).subscribe(
        (data: any) => {
          this.createAccount.patchValue({
            userName: data.userDTO.userName,
            employee: data.userDTO.lastName + " " + data.userDTO.firstName,
          })
        }
      )
    }
  }

  handleOk(): void {
    this.modalRef.destroy(true)
  }

  handleCancel(): void {
    this.modalRef.destroy(false)
  }
  submit() {
    if (this.createAccount.invalid) {
      this.markFormGroupTouched(this.createAccount);
      return;
    }
    const val = {
      ...this.createAccount.value,
    };
    if (this.id) {
      this.updateAccount(this.id, val);
    } else {
      this.onCreateAccount();
    }
  }
  updateAccount(id: string, val: any) {
    this.shared.editAccount(id, val).subscribe({
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
  onCreateAccount(): void {
    const userName = this.createAccount.value.userName as string;
    const password = this.createAccount.value.password as string;
    const confirmPassword = this.createAccount.value.confirmPassword as string;

    this.shared.createAccount(userName, password, confirmPassword)
      .subscribe((result) => {
        if (result.status != null) {
          const modal = this.tModalSvc.success({
            title: 'Thành công',
            content: `<h5 class="text-success-500">Tạo tài khoản <strong>${userName}</strong> thành công!</h5>`,
            footer: null,
            size: 'sm',
            okText: 'Xác nhận',
            onOk: () => true
          });
          modal.afterClose.asObservable().subscribe(() => this.modalRef.destroy());
        }
        else {
          const modal = this.tModalSvc.error({
            title: 'Thất bại',
            content: `<h5 class="text-error-500">Tạo tài khoản <strong>${userName}</strong> thất bại! Tài khoản đã tồn tại!</h5>`,
            footer: null,
            size: 'md',
            okText: 'Xác nhận',
            onOk: () => true
          });
          modal.afterClose.asObservable()
            .subscribe
            (res => {
              if (res) {
                this.createAccount;
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
