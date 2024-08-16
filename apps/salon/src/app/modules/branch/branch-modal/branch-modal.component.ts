import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { TDSColumnSettingsModule } from 'tds-ui/column-settings';
import { TDSDataTableModule } from 'tds-ui/data-table';
import { TDSListModule } from 'tds-ui/list';
import { UsersModalComponent } from '../../users/users-modal/users-modal.component';
import { TDSTimelineModule } from 'tds-ui/timeline';
import { TDSToolTipModule } from 'tds-ui/tooltip';
import { TDSButtonModule } from 'tds-ui/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSSelectModule } from 'tds-ui/select';
import { TDSCascaderModule } from 'tds-ui/cascader';
import { TDSPaginationModule } from 'tds-ui/pagination';
import { TDSModalModule, TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { AuthService } from '../../../shared.service';
import { TDSNotificationService } from 'tds-ui/notification';
import { TDSDatePickerModule } from 'tds-ui/date-picker';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSRadioModule } from 'tds-ui/radio';
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;

@Component({
  selector: 'frontend-branch-modal',
  templateUrl: './branch-modal.component.html',
  styleUrls: ['./branch-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TDSListModule,
    TDSDataTableModule,
    TDSColumnSettingsModule,
    UsersModalComponent,
    TDSTimelineModule,
    TDSToolTipModule,
    TDSButtonModule,
    ReactiveFormsModule,
    TDSFormFieldModule,
    TDSSelectModule,
    FormsModule,
    TDSCascaderModule,
    TDSPaginationModule,
    TDSDatePickerModule,
    TDSModalModule,
    TDSInputModule,
    TDSRadioModule,
  ],
})
export class BranchModalComponent implements OnInit {

  private readonly tModalSvc = inject(TDSModalService)
  private readonly modalRef = inject(TDSModalRef);
  @Input() id?: number;
  branchId?: number;
  userSession: any;
  storedUserSession = localStorage.getItem('userSession');
  createBranch = inject(FormBuilder).nonNullable.group({
    branchName: [
      '',
      Validators.compose([
        Validators.required,
      ])
    ],
    branchAddress: [
      '',
      Validators.compose([
        Validators.required,
      ])
    ],
    branchPhone: [
      '',
      Validators.compose([
        Validators.required,
        Validators.pattern(/^[0]{1}[0-9]{9}$/)
      ])
    ],

  });

  constructor(
    private shared: AuthService,
    private notification: TDSNotificationService
  ) { }

  ngOnInit(): void {
    if (this.storedUserSession !== null) {
      this.userSession = JSON.parse(this.storedUserSession);
      this.branchId = this.userSession.user.branchID;
    }
    if (this.id) {
      this.shared.getBranchById(this.id).subscribe(
        (data: any) => {
          this.createBranch.patchValue({
            branchName: data.branchDTO.branchName,
            branchAddress: data.branchDTO.branchAddress,
            branchPhone:data.branchDTO.branchPhone,
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
    if (this.createBranch.invalid) {
      this.markFormGroupTouched(this.createBranch);
      return;
    }
    const val = {
      ...this.createBranch.value,
    };
    if (this.id) {
      this.updateBranch(this.id, val);
    } else {
      this.onCreateBranch();
    }
  }
  updateBranch(id: number, val: any) {
    this.shared.editBranch(id, val).subscribe({
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
  onCreateBranch(): void {
    const branchName = this.createBranch.value.branchName as string;
    const branchAddress = this.createBranch.value.branchAddress as string;
    const branchPhone = this.createBranch.value.branchPhone as string;

    this.shared.createBranch(branchName, branchAddress, branchPhone)
      .subscribe((result) => {
        if (result.id != null) {
          const modal = this.tModalSvc.success({
            title: 'Thành công',
            content: `<h5 class="text-success-500">Tạo chi nhánh <strong>${branchName}</strong> thành công!</h5>`,
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
            content: `<h5 class="text-error-500">Tạo chi nhánh <strong>${branchName}</strong> thất bại!</h5>`,
            footer: null,
            size: 'md',
            okText: 'Xác nhận',
            onOk: () => true
          });
          modal.afterClose.asObservable()
            .subscribe
            (res => {
              if (res) {
                this.createBranch;
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
