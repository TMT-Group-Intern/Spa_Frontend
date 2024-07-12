import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceListComponent } from './modules/service-list/service-list.component';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { CustomerListComponent } from './modules/customer-list/customer-list.component';
import { RevenueStaticsModule } from './modules/revenue-statistics/revenue-statistics.module';
import { HomeComponent } from './modules/home/home.component';
import { UsersComponent } from './modules/users/users.component';
import { CustomerDetailComponent } from './modules/customer-list/customer-detail/customer-detail.component';
import { TechnicalStaffComponent } from './modules/technical-staff/technical-staff.component';
import { TreatmentDetailComponent } from './modules/technical-staff/treatment-detail/treatment-detail.component';
import { DoctorComponent } from './modules/doctor/doctor.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { SchedulesComponent } from './modules/schedule/schedule.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  //{ path: 'protected', canActivate: [AuthGuardService], component:  UsersComponent},
  {
    path: '',
    component: LayoutComponent,canActivate: [AuthGuardService],
    children: [
      { path: 'home', loadComponent: () => HomeComponent },
      { path: 'schedule', loadComponent: () => SchedulesComponent },
      { path: 'service-list', loadComponent: () => ServiceListComponent },
      { path: 'customer-list', loadComponent: () => CustomerListComponent },
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
            path: 'customer-detail/:id',
            loadComponent: () => CustomerDetailComponent,
          },
        ],
      },
      { path: 'doctor', loadComponent: () => DoctorComponent },
      { path: 'revenue-statistics', loadChildren: () => RevenueStaticsModule },
      {path: 'users', loadComponent: ()=> UsersComponent}
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
