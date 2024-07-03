import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSCalendarModule } from 'tds-ui/calendar';
import { TDSDatePickerModule } from 'tds-ui/date-picker';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSModalModule, TDSModalRef, TDSModalService} from 'tds-ui/modal';
import { TDSSelectModule } from 'tds-ui/select';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSTimePickerModule } from 'tds-ui/time-picker';
import { TDSNotificationService } from 'tds-ui/notification';
import { startOfToday, isBefore } from 'date-fns';
import { AuthService } from '../../../shared.service';
import { TDSToolTipModule } from 'tds-ui/tooltip';
import { UserProfileComponent } from '../../user-profile/user-profile.component';

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
    TDSSelectModule,
    TDSToolTipModule
  ]
})
export class ServiceAppointmentModalComponent implements OnInit {

  public doctorOptions = [
    { id: 11, name: 'Elton John' },
    { id: 12, name: 'Elvis Presley' },
    { id: 5, name: 'Paul McCartney' },
    { id: 14, name: 'Elton John' },
    { id: 13, name: 'Elvis Presley' },
  ]

  public statusOptions = [
    'Scheduled',
    'Confirmed',
    'Cancelled',
    'Waiting',
    'Examining',
    'Preparation',
    'Treatment in Progress',
  ]

  private readonly modalRef = inject(TDSModalRef);
private readonly modalSvc = inject(TDSModalService);
  @Input() id?: number;
  createAppointmentForm!: FormGroup;
  form = inject(FormBuilder).nonNullable.group({
    customerID: [],
    name: [''],
    branch: [''],
    phone: ['', [Validators.required, Validators.pattern(/^[0]{1}[0-9]{9}$/)]],
    employeeID: [[0]],
    assignments: [[]],
    doctor: [0],
    appointmentDate: ['', Validators.required],
    status: [''],
    service:[[]]
  });

  today = startOfToday();
  empID: any[] = []
  dataSvc: any = []
  CustomerID: number | undefined;

  constructor(
    private shared: AuthService,
    private notification: TDSNotificationService,

  ) { }

  ngOnInit(): void {

    // call function initService
    this.initService();

    this.form.get('name')?.disable()
    this.form.get('branch')?.disable()
    this.form.get('doctor')?.disable()
    this.form.get('appointmentDate')?.disable()

    if (this.id) {
      this.form.get('phone')?.disable()
      this.shared.getAppointment(this.id).subscribe((data: any) => {
      console.log(data.ChooseServices)
        this.CustomerID = data.CustomerID
        this.form.patchValue({
          phone: data.Customer.Phone,
          name: data.Customer.FirstName + ' ' + data.Customer.LastName,
          appointmentDate: data.AppointmentDate,
          customerID: data.Customer.CustomerID,
          status: data.Status,
          service: data.ChooseServices.map((item:any)=> item.ServiceID),
        });
      });
    }
  }
  initService(): void {
    //Display Service List
    this.shared.renderListService().subscribe((data:any) =>
      {
        this.dataSvc = data.serviceDTO;
      }
    )
  }


  // Disabled Date in the past
  disabledDate = (d: Date): boolean => {
    // Disable all days before today
    return isBefore(d, this.today);
  };


  // Submit button
  submitUpdateServiceAppointment() {

    if (this.form.invalid) return;

    const val = {
      ...this.form.value
    };

    if (this.id) {
    this.updateServiceAppointment(this.id, val.status, val.service);
  }
  }

  // Update service Appointment
  updateServiceAppointment(id: number, status: any, val: any) {
    console.log(id,",",val)
    this.shared.updateAppointmentWithService(id, status, val).subscribe({
      next:(data) => {
        console.log(data)
        this.createNotificationSuccess('');
        this.modalRef.destroy(val);
      },
      error:(res) => {
        this.createNotificationError(res.error.message);
      }
    }
    );
  }

  // call modal user profile
  callModalUserProfile(){
    this.modalSvc.create({
      title:"Hồ sơ",
      content: UserProfileComponent,
      footer:null,
      size: "lg",
      componentParams:{
        customerId: this.CustomerID
      }
    })
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
