import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceListComponent } from './modules/service-list/service-list.component';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { CustomerListComponent } from './modules/customer-list/customer-list.component';
import { HomeComponent } from './modules/home/home.component';
import { UsersComponent } from './modules/users/users.component';
import { CustomerDetailComponent } from './modules/customer-list/customer-detail/customer-detail.component';
import { TechnicalStaffComponent } from './modules/technical-staff/technical-staff.component';
import { TreatmentDetailComponent } from './modules/technical-staff/treatment-detail/treatment-detail.component';
import { DoctorComponent } from './modules/doctor/doctor.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { SchedulesComponent } from './modules/schedule/schedule.component';
import { AppointmentListModule } from './modules/appointment-list/appointment-list.module';
import { ChatboxComponent } from './modules/chatbox/chatbox.component';
import { RoleComponent } from './modules/role/role.component';
import { AccountComponent } from './modules/account/account.component';
import { InvoiceComponent } from './modules/invoice/invoice.component';
import { BranchComponent } from './modules/branch/branch.component';
import { JobComponent } from './modules/job/job.component';
import { TreasuryComponent } from './modules/treasury/treasury.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: 'home', loadComponent: () => HomeComponent },
      { path: 'schedule', loadComponent: () => SchedulesComponent },
      { path: 'service-list', loadComponent: () => ServiceListComponent },
      { path: 'customer-list', loadComponent: () => CustomerListComponent },
      { path: 'chat-box', loadComponent: () => ChatboxComponent },
      { path: 'technical-staff', loadComponent: () => TechnicalStaffComponent },
      {
        path: 'technical-staff',
        children: [
          {
            path: 'treatment-detail/:id',
            loadComponent: () => TreatmentDetailComponent,
          },
        ],
      },
      {
        path: 'customer-list',
        children: [
          {
            path: 'customer-detail',
            loadComponent: () => CustomerDetailComponent,
          },
        ],
      },
      { path: 'doctor', loadComponent: () => DoctorComponent },
      { path: 'invoice', loadComponent: () => InvoiceComponent },
      { path: 'report', loadChildren: () => import("./modules/revenue-statistics/revenue-statistics.module").then(m => m.RevenueStaticsModule) },
      {
        path: 'report/report-day',
        loadComponent: () =>
          import(
            './modules/reporting-date/reporting-date.component'
          ).then((m) => m.ReportingDateComponent),
      },
      { path: 'users', loadComponent: () => UsersComponent },
      { path: 'appoitmentList', loadChildren: () => AppointmentListModule },
      { path: 'role', loadComponent: () => RoleComponent },
      { path: 'account', loadComponent: () => AccountComponent },
      { path: 'chatbox', loadComponent: () => ChatboxComponent },
      { path: 'branch', loadComponent: () => BranchComponent },
      { path: 'job', loadComponent: () => JobComponent },
      { path: 'treasury', loadComponent: () => TreasuryComponent },
      { path: '', loadChildren: () => import("./modules/treatment-plan/treatment-plan.module").then(m => m.TreatmentPlanModule) },

    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
