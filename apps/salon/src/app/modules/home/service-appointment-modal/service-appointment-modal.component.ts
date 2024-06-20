import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSCalendarModule } from 'tds-ui/calendar';
import { TDSDatePickerModule } from 'tds-ui/date-picker';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSModalModule, TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSSelectModule } from 'tds-ui/select';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSTimePickerModule } from 'tds-ui/time-picker';
import { TDSNotificationService } from 'tds-ui/notification';
import { startOfToday, isBefore } from 'date-fns';
import { AuthService } from '../../../shared.service';
import { number } from 'echarts';

@Component({
  selector: 'frontend-service-appointment-modal',
  templateUrl: './service-appointment-modal.component.html',
  styleUrls: ['./service-appointment-modal.component.scss'],
  standalone: true,
  imports:[
    CommonModule,
    ReactiveFormsModule,
    TDSButtonModule,
    TDSInputModule,
    TDSDatePickerModule,
    TDSModalModule,
    TDSTimePickerModule,
    TDSCalendarModule,
    TDSFormFieldModule,
    TDSSelectModule
  ]
})
export class ServiceAppointmentModalComponent implements OnInit {

  public doctorOptions = [
    { id: 11, name: 'Elton John' },
    { id: 12, name: 'Elvis Presley' },
    { id: 9, name: 'Paul McCartney' },
    { id: 14, name: 'Elton John' },
    { id: 13, name: 'Elvis Presley' },
  ]

  public statusOptions = [
    'Comming',
    'Comming2',
  ]

  private readonly tModalSvc = inject(TDSModalService)
  private readonly modalRef = inject(TDSModalRef);
  @Input() id?: number;
  createAppointmentForm!: FormGroup;
  form = inject(FormBuilder).nonNullable.group({
    customerID: [],
    name: [''],
    branch: ['ABC'],
    phone: ['', [Validators.required, Validators.pattern(/^[0]{1}[0-9]{9}$/)]],
    employeeID: [[0]],
    assignments: [[]],
    doctor: [0],
    appointmentDate: ['', Validators.required],
    status: [''],
    service:['']
  });
  isExist = false;
  isHide = false;
  today = startOfToday();
  empID: any[] = []
  dataSvc: any = []
  valSvc:any[number] = [number]

  constructor(
    private shared: AuthService,
    private notification: TDSNotificationService,
  ) { }

  ngOnInit(): void {
    this.form.get('name')?.disable()
    this.form.get('branch')?.disable()
    this.form.get('doctor')?.disable()
    this.form.get('appointmentDate')?.disable()

    if (this.id) {
      this.form.get('phone')?.disable()
      this.shared.getAppointment(this.id).subscribe((data: any) => {
        console.log(data);
        this.form.patchValue({
          phone: data.Customer.Phone,
          name: data.Customer.FirstName + ' ' + data.Customer.LastName,
          appointmentDate: data.AppointmentDate,
          customerID: data.Customer.CustomerID,
          status: data.Status,
        });
      });
      //Display Service List
        this.shared.renderListService().subscribe((data:any) =>
        {
          this.shared = data.serviceDTO;
          this.dataSvc = data
        }
      )
    console.log(this.dataSvc)
    }



  }



  // Disabled Date in the past
  disabledDate = (d: Date): boolean => {
    // Disable all days before today
    return isBefore(d, this.today);
  };

  // Cancel button
  handleCancel(): void {
    this.modalRef.destroy(null);
  }

  // Submit button
  submitUpdateServiceAppointment() {

    if (this.form.invalid) return;

    const val = {
      ...this.form.value
    };
    this.valSvc = [ val.service
    ];
    console.log(val.service)
    // Add employee to the array
    this.empID.push(this.form.value.doctor)
    this.form.patchValue({
      employeeID: this.empID
    });

    if (this.id) {
      this.updateServiceAppointment(this.id, this.valSvc);
    }
  }


  // Update service Appointment
  updateServiceAppointment(id: number, val: any) {
    console.log(id,",",val)
    this.shared.UpdateAppointmentWithService(id, val).subscribe(
      (data) => {
        console.log(data)
        this.createNotificationSuccess('');
        this.modalRef.destroy(val);
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
