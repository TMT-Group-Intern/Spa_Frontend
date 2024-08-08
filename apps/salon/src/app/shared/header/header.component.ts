//import { ModalRegisterComponent } from './../modal-register/modal-register.component';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSHeaderModule } from 'tds-ui/header';
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { TDSSelectModule } from 'tds-ui/select';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSInputModule } from 'tds-ui/tds-input';
import { Router, RouterModule } from '@angular/router';
import { TDSToolTipModule } from 'tds-ui/tooltip';
import { TDSModalModule, TDSModalService } from 'tds-ui/modal';
import { AuthService } from '../../shared.service';
import { TDSCascaderModule, TDSCascaderOption } from 'tds-ui/cascader';
import { HomeComponent } from '../../modules/home/home.component';
import { CompanyService } from '../../core/services/company.service';
import { TDSDropDownModule } from 'tds-ui/dropdown';
import { ChangePassComponent } from './change-pass/change-pass.component';
import { tap } from 'rxjs';


@Component({
  selector: 'frontend-header',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    TDSHeaderModule,
    TDSFormFieldModule,
    TDSSelectModule,
    FormsModule,
    TDSButtonModule,
    TDSInputModule,
    RouterModule,
    TDSToolTipModule,
    TDSModalModule,
    TDSCascaderModule,
    TDSDropDownModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  public contact = 1;
  userSession: any;
  private readonly tModalSvc =inject(TDSModalService)
  branchOptions: any[] = [];
  branchName='';
  public branchID = 0;
  selectedBranch :any;
  signUpForm!: FormGroup;
  branch = inject(FormBuilder).nonNullable.control({
    branch: [''],
  });

  ngOnInit() {

    const storedUserSession = localStorage.getItem('userSession');
    if (storedUserSession !== null) {
      this.userSession = JSON.parse(storedUserSession);
      const branchId = this.userSession.user.branchID;
      this.companySvc._companyIdCur$.next(this.userSession.user.branchID);
    }
    if(this.userSession.user.role ==='Admin'){
      this.branchID = this.userSession.user.branchID
      //this.branchName = this.userSession.user.branch
      localStorage.setItem('userSession', JSON.stringify(this.userSession));
    }

    this.shared.getBranch().subscribe(
      (data: any[]) => {
        this.branchOptions = [...data.map(item => ({
          id: item.branchID,
          name: item.branchName,
        }))]

      })
  }
  constructor(
    private shared: AuthService,
    private fb: FormBuilder,
    private modalSvc: TDSModalService,
    private router: Router,
    private companySvc: CompanyService
  ) {
  }
  changePassword(){
    const modal = this.tModalSvc.create({
      title:'Đổi mật khẩu',
      content: ChangePassComponent,
      footer:null,
      size:'md',
    });
    modal.afterClose.asObservable().subscribe();
  }
  onBranchChanges(values: string[]): void {
    this.selectedBranch=this.branchID
    this.userSession.user.branchID=this.selectedBranch
    this.companySvc._companyIdCur$.next(this.branchID)
    localStorage.setItem('userSession', JSON.stringify(this.userSession));
  };
  onLogOut() {
    localStorage.removeItem('userSession');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('appointmentDetail');
    localStorage.removeItem('customerID');
    deleteCookie('userToken')
    this.router.navigate(['']);
  };
}
function deleteCookie(cookieName: any) {
  document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}


