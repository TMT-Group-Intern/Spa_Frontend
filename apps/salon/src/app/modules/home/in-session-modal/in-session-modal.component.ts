import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TDSModalModule, TDSModalRef } from 'tds-ui/modal';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSRadioModule } from 'tds-ui/radio';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSSelectModule } from 'tds-ui/select';
import { AuthService } from '../../../shared.service';
import { TDSNotificationService } from 'tds-ui/notification';

@Component({
  selector: 'frontend-in-session-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TDSModalModule,
    TDSFormFieldModule,
    TDSRadioModule,
    TDSInputModule,
    TDSButtonModule,
    TDSSelectModule,
  ],
  templateUrl: './in-session-modal.component.html',
  styleUrls: ['./in-session-modal.component.scss'],
})
export class InSessionModalComponent implements OnInit {

  @Input() id?: number
  private readonly modalRef = inject(TDSModalRef);
  public spaTherapistOptions: any[] = []
  public statusOptions = [
    'Chờ làm',
    'Đang làm',
    'Hoàn thành',
    'Đã khám',
  ]
  createAppointmentForm!: FormGroup;
  form = inject(FormBuilder).nonNullable.group({
    customerID: [],
    name: [''],
    assignments: [],
    spaTherapist: [],
    status: ['Đang chuẩn bị'],
  });
  assignments: any[] = []

  constructor(
    private shared: AuthService,
    private notification: TDSNotificationService,
  ) { }

  ngOnInit(): void {

    this.form.get('name')?.disable()

    if (this.id) {
      this.shared.getAppointment(this.id).subscribe(
        (data: any) => {

          this.form.patchValue({
            name: data.Customer.FirstName + ' ' + data.Customer.LastName,
            customerID: data.Customer.CustomerID,
            status: data.Status,
          });
          this.assignments = data.Assignments
          const foundSpaTherapist = this.assignments.find(item => item.Employees.JobTypeID === 3);
          if(foundSpaTherapist) {
            this.form.patchValue({
              spaTherapist: foundSpaTherapist.Employees.EmployeeID
            });
          }
          console.log(this.form.get('spaTherapist')?.value)
        }
      )
    }

    // Get Spa Therapist
    this.shared.getEmployee(1, 3).subscribe(
      (data: any[]) => {
        this.spaTherapistOptions = [...data.map(item => ({
          id: item.employeeID,
          name: `${item.firstName} ${item.lastName}`
        }))]
      })

  }

  // Cancel button
  handleCancel(): void {
    this.modalRef.destroy(null);
  }

  // Submit button
  submit() {

    if (this.form.invalid) return;

    this.shared.assignSpaTherapist(this.id, this.form.value.spaTherapist, '').subscribe(
      () => {
        this.shared.UpdateStatus(this.id, this.form.value.status).subscribe(
          () => {
            this.createNotificationSuccess('');
            this.modalRef.destroy(this.id);
          },
          (res) => {
            this.createNotificationError(res.error.message);
          }
        );
      },
      (res) => {
        this.createNotificationError(res.error.message);
      }
    );

  }

  // Success Notification
  createNotificationSuccess(content: any): void {
    this.notification.success(
      'Succesfully', content
    );
  }

  // Error Notification
  createNotificationError(content: any): void {
    this.notification.error(
      'Error', content
    );
  }

}
