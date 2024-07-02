import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceListComponent } from './modules/service-list/service-list.component';
import { LoginComponent } from './login/login.component';
import { ProductsComponent } from './modules/products/products.component';
import { LayoutComponent } from './layout/layout.component';
import { CustomerListComponent } from './modules/customer-list/customer-list.component';
import { RegisterComponent } from './register/register.component';
import { RevenueStaticsModule } from './modules/revenue-statistics/revenue-statistics.module';
import { EmployeeListComponent } from './modules/employee-list/employee-list.component';
import { HomeComponent } from './modules/home/home.component';
import { CustomerDetailComponent } from './modules/customer-list/customer-detail/customer-detail.component';
import { TechnicalStaffComponent } from './modules/technical-staff/technical-staff.component';
import { TreatmentDetailComponent } from './modules/technical-staff/treatment-detail/treatment-detail.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'home', loadComponent: () => HomeComponent },
      { path: 'products', loadComponent: () => ProductsComponent },
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
      { path: 'revenue-statistics', loadChildren: () => RevenueStaticsModule },
      { path: 'employee-list', loadComponent: () => EmployeeListComponent },
    ],
  },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
