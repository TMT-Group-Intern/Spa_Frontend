import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TDSModalModule, TDSModalRef } from 'tds-ui/modal';
import { TDSInputModule } from 'tds-ui/tds-input';
import { TDSButtonModule } from 'tds-ui/button';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../../shared.service';
import { TDSSelectModule } from 'tds-ui/select';
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;
@Component({
  selector: 'frontend-modal-register',
  standalone: true,
  imports: [CommonModule, TDSFormFieldModule, ReactiveFormsModule, TDSModalModule, TDSInputModule, TDSButtonModule, TDSSelectModule],
  templateUrl: './modal-register.component.html',
  styleUrls: ['./modal-register.component.scss'],
})
export class ModalRegisterComponent {
  private auth= inject(AuthService)
  private readonly modalRef= inject(TDSModalRef)
  signUpForm = inject(FormBuilder).nonNullable.group({
    // phoneNumber: ['', Validators.compose([
    //     Validators.required,
    //     Validators.pattern(/^[0-9]{10}$/i)
    // ])],
    email: [
        '',
        Validators.compose([
        Validators.required,
        Validators.email
        ])
    ],
    taiKhoan:['' , Validators.required],
    chucvu:['' , Validators.required],

    pass: [
        '',
        Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(PASSWORD_PATTERN)
        ])
    ],
    retype: [
        '',
        Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(PASSWORD_PATTERN)
        ])
    ],

    });

     readonly contactOptions = [ { id: 1, name: ' Elton John ' },
      { id: 2, name: 'Elvis Presley' },
      { id: 3, name: 'Paul McCartney' },
      { id: 4, name: 'Elton John' },
      { id: 5, name: 'Elvis Presley' },
      { id: 6, name: 'Paul McCartney' }]

    handleOk(): void {
      console.log('Button ok clicked!');
      this.modalRef.destroy(true)
    }

    handleCancel(): void {
      console.log('Button cancel clicked!');
      this.modalRef.destroy(false)
    }

    onSignUp():void{
      console.log(1)
      const id = uuidv4();
      const name = this.signUpForm.value.taiKhoan as string;
      const email = this.signUpForm.value.email as string;
      const password = this.signUpForm.value.pass as string;
      const re_password = this.signUpForm.value.retype as string;

      if (this.signUpForm.invalid) {
        this.markFormGroupTouched(this.signUpForm);
        return;
      }
      // Thực hiện các hành động khi form hợp lệ
      this.auth.signUp(id,name,email,password,re_password).subscribe((result) =>{
        console.log(result);
        console.log(id,name,email,password,re_password);
        if(result.message != null){
            alert(result.message)
            if(result.flag == true){
                this.signUpForm.reset();
            }
        }
    });
      console.log(this.signUpForm.value);
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
