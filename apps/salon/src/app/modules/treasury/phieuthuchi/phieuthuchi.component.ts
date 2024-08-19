import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../shared.service';
import { TDSNotificationService } from 'tds-ui/notification';
import { TDSModalRef } from 'tds-ui/modal';


@Component({
  selector: 'frontend-phieuthuchi',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './phieuthuchi.component.html',
  styleUrls: ['./phieuthuchi.component.scss'],
})
export class PhieuthuchiComponent implements OnInit {
  private readonly modalRef = inject(TDSModalRef);
  constructor(private fb: FormBuilder, private shareApi: AuthService, private notification: TDSNotificationService) { }

  taoPhieuThu = this.fb.group(
    {
      Description: ["", Validators.required],
      Amount: ["", Validators.pattern("^[0-9]*$")],
      TypeOfIncome: [""],
      PayMethod: [""],
    });


  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onSubmit() {
    const val = {
      ...this.taoPhieuThu.value
    }
    console.log(val);
    this.shareApi.taoPhieuThuChi(val).subscribe(() => {
      this.createNotificationSuccess('');
      this.modalRef.destroy();
    },
      () => this.createNotificationError('')

    )
  }

  createNotificationSuccess(content: any): void {
    this.notification.success('Succesfully', content);
  }

  // Error Notification
  createNotificationError(content: any): void {
    this.notification.error('Error', content);
  }



}
