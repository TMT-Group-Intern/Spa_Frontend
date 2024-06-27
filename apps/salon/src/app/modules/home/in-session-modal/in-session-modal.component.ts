import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TDSModalModule } from 'tds-ui/modal';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSRadioModule } from 'tds-ui/radio';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSSelectModule } from 'tds-ui/select';

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
  public doctorOptions = [
    {id: 9, name: 'D'},
    {id: 10, name: 'E'},
    {id: 11, name: 'F'},
  ]
  public statusOptions = [
    'Scheduled',
    'Confirmed',
    'Cancelled',
    'Waiting',
    'Examining',
    'Preparation',
    'Treating',
  ]
  createAppointmentForm!: FormGroup;
  form = inject(FormBuilder).nonNullable.group({
    customerID: [],
    name: [''],
    assignments: [],
    doctor: [0],
    appointmentDate: [new Date()],
    status: ['Preparation'],
    total: []
  });

  ngOnInit(): void {

    this.form.get('name')?.disable()

  }

  // Submit button
  submit() {

    if (this.form.invalid) return;

  }

}
