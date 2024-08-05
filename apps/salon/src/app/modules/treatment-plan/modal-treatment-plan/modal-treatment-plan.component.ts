import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'frontend-modal-treatment-plan',
  templateUrl: './modal-treatment-plan.component.html',
  styleUrls: ['./modal-treatment-plan.component.scss'],
})
export class ModalTreatmentPlanComponent {
  public sessionOptions = [
    { id: 1, name: '1 buổi' },
    { id: 2, name: '2 buổi' },
    { id: 3, name: '3 buổi' },
    { id: 4, name: '4 buổi' },
    { id: 5, name: '5 buổi' },
    { id: 6, name: '5 buổi' },
    { id: 7, name: '7 buổi' },
    { id: 8, name: '8 buổi' },
    { id: 9, name: '9 buổi' },
    { id: 10, name: '10 buổi'}
  ]
  public frequencyOptions=
    [
      { id: 1, name: 'day' },
      { id: 2, name: 'day' },
      { id: 3, name: 'day' },
      { id: 4, name: 'day' },
      { id: 5, name: 'day' },
      { id: 6, name: 'day' },
      { id: 7, name: 'day' },
      { id: 1, name: 'week' },
      { id: 2, name: 'week' },
      { id: 3, name: 'week' },
      { id: 4, name: 'week' },
      { id: 1, name: 'month' },
      { id: 2, name: 'month' },
      { id: 3, name: 'month' },
      { id: 4, name: 'month' },
      { id: 5, name: 'month' },
      { id: 6, name: 'month' },
      { id: 7, name: 'month' },
      { id: 8, name: 'month' },
      { id: 9, name: 'month' },
      { id: 10, name: 'month' },
      { id: 11, name: 'month' },
      { id: 12, name: 'month' }
    ]

  selectSessionOptions = 1
  selectFrequencyOptions = 1

  form = inject(FormBuilder).nonNullable.group({
    serviceID: [''],
    treatmentName: ['', Validators.required],
    note: [''],
    totalSessions:[''],
    interval:['']
  });
}
