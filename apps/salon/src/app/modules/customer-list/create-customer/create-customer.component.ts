import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSModalModule } from 'tds-ui/modal';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSFormInputModule } from 'tds-ui/input';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TDSRadioModule } from 'tds-ui/radio';

@Component({
  selector: 'frontend-create-customer',
  standalone: true,
  imports: [
    CommonModule,
    TDSModalModule,
    TDSFormFieldModule,
    TDSFormInputModule,
    TDSRadioModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss'],
})
export class CreateCustomerComponent implements OnInit{

  isVisible = false;
  signUpForm!: FormGroup;

  // Display modal
  showModal(): void {
    this.isVisible = true;
  }


  // Save button
  handleOk(): void {
    console.log("Button ok clicked!");
    this.isVisible = false;
  }

  // Cancel button
  handleCancel(): void {
    console.log("Button cancel clicked!");
    this.isVisible = false;
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
