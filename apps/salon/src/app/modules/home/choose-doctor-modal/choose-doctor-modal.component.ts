import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TDSModalModule, TDSModalRef } from 'tds-ui/modal';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSSelectModule } from 'tds-ui/select';
import { TDSButtonModule } from 'tds-ui/button';
import { AuthService } from '../../../shared.service';
import { TDSNotificationService } from 'tds-ui/notification';

@Component({
  selector: 'frontend-choose-doctor-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TDSModalModule,
    TDSFormFieldModule,
    TDSSelectModule,
    TDSButtonModule,
  ],
  templateUrl: './choose-doctor-modal.component.html',
  styleUrls: ['./choose-doctor-modal.component.scss'],
})
export class ChooseDoctorModalComponent implements OnInit {

  private readonly modalRef = inject(TDSModalRef);
  @Input() id?: number
  @Input() appointmentDate?: string
  public doctorOptions = [
    {id: 6, name: 'A'},
    {id: 7, name: 'B'},
    {id: 8, name: 'C'},
  ]
  form = inject(FormBuilder).nonNullable.group({
    doctor: [undefined ,Validators.required],
  });

  constructor(
    private shared : AuthService,
    private notification: TDSNotificationService,
  ){}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  // Submit button
  submit() {
    if(this.form.invalid) return

    const val = {
      assignments: [{employerID: this.form.value.doctor}],
      appointmentDate: this.appointmentDate
    }

    if(this.id) {
      this.shared.UpdateAppointment(this.id, val).subscribe(
        () => {
          this.createNotificationSuccess('');
          this.modalRef.destroy(val);
        }
      )
    }

  }

  // Success Notification
  createNotificationSuccess(content: any): void {
    this.notification.success(
      'Succesfully', content
    );
  }

}
