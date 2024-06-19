import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TDSModalModule, TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSRadioModule } from 'tds-ui/radio';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSDatePickerModule } from 'tds-ui/date-picker';
import { CustomerListComponent } from '../../customer-list/customer-list.component';
import { AuthService } from '../../../shared.service';
import { TDSCalendarModule } from 'tds-ui/calendar';
import { TDSButtonModule } from 'tds-ui/button';
import { CustomerModalComponent } from '../../customer-list/customer-modal/customer-modal.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'frontend-appointment-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TDSModalModule,
    TDSFormFieldModule,
    TDSRadioModule,
    TDSInputModule,
    TDSDatePickerModule,
    CustomerListComponent,
    TDSCalendarModule,
    TDSButtonModule,
  ],
  templateUrl: './appointment-modal.component.html',
  styleUrls: ['./appointment-modal.component.scss'],
})
export class AppointmentModalComponent implements OnInit {

  private readonly tModalSvc =inject(TDSModalService)
  private readonly modalRef = inject(TDSModalRef);
  private readonly modalService = inject(TDSModalService);
  @Input() id?: number;
  createAppointmentForm!: FormGroup;
  form = inject(FormBuilder).nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    branch: ['ABC'],
    phone: ['', [Validators.required, Validators.pattern(/^[0]{1}[0-9]{9}$/)]],
    dateOfBirth: ['', Validators.required],
    gender: ['Male'],
  });
  noCustomer: any;

  constructor(
    private shared: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {

    this.form.get('firstName')?.disable()
    this.form.get('lastName')?.disable()
    this.form.get('branch')?.disable()

    if (this.id) {
      this.shared.getCustomer(this.id).subscribe((data: any) => {
        console.log(data);
        this.form.patchValue(data.customerDTO);
      });
    }
  }

  // Cancel button
  handleCancel(): void {
    this.modalRef.destroy(null);
  }

  // Submit button
  submit() {
    if (this.form.invalid) return;

    const val = {
      ...this.form.value,
    };

    if (this.id) {
      this.updateCustomer(this.id, val);
    } else {
      this.createAppointment(val);
    }
  }

  // Search Customer
  searchCustomer () {
    const elements = document.querySelectorAll('span.no-customer')
    this.shared.searchCustomer(this.form.value.phone).subscribe(
      (res: any) => {
        if (res.customers.length == 0) {
          elements.forEach((element) => {
            (element as HTMLElement).style.display = 'block';
          });
        } else {
          this.form.patchValue({
            firstName: res.customers[0].firstName,
            lastName: res.customers[0].lastName,
          });
          elements.forEach((element) => {
            (element as HTMLElement).style.display = 'none';
          });
        }
      },
    )
  }

  // searchCustomer () {
  //   // const elements = document.querySelectorAll('span.no-customer')
  //   this.shared.searchCustomer(this.form.value.phone).subscribe(
  //     (res: any) => {
  //       if (res.customers.length == 0) {
  //         this.noCustomer = this.sanitizer.bypassSecurityTrustHtml( '<a (click)="createCustomer()">Create</a>')
  //       } else {
  //         this.form.patchValue({
  //           firstName: res.customers[0].firstName,
  //           lastName: res.customers[0].lastName,
  //         });
  //         // elements.forEach((element) => {
  //         //   (element as HTMLElement).style.display = 'none';
  //         // });
  //       }
  //     },
  //   )
  // }

  // Create Customer
  createAppointment (val: any) {
    this.shared.createAppointment(val).subscribe(
        {
          next: () => {
            this.modalService.success({
              title: 'Successfully',
              okText: 'OK',
            });
            this.modalRef.destroy(val);
          },
          error: (res) => {
            this.modalService.error({
              title: 'Error',
              content: res.error.message,
              okText: 'OK'
            });
          },
        }
      );
  }

  // Create Customer
  createCustomer(){
    const modal = this.tModalSvc.create({
      title:'Create Customer',
      content: CustomerModalComponent,
      footer:null,
      size:'lg'
    });
    modal.afterClose.asObservable().subscribe(res=>{
      if(res){
        //
      }
    })
  }

  // Update Customer
  updateCustomer(id: number, val: any) {
    this.shared.UpdateCustomer(id, val).subscribe(
      () => {
        this.modalService.success({
          title: 'Successfully',
          okText: 'OK',
        });
        this.modalRef.destroy(val);
      },
      (res) => {
        this.modalService.error({
          title: 'Error',
          content: res.error.message,
          okText: 'OK',
        });
      }
    );
  }

}
