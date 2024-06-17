import { NgModule } from '@angular/core';
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

const routes: Routes = [
  {path: 'login', component:LoginComponent},
  {
    path: '', component: LayoutComponent,
    children:[
      {path: 'home', loadComponent: ()=> HomeComponent},
      {path: 'products', loadComponent: ()=> ProductsComponent},
    ]
   },
   {
    path: '', component: LayoutComponent,
    children:[
      {path: 'service-list', loadComponent: ()=> ServiceListComponent},
      {path: 'customer-list', loadComponent: ()=> CustomerListComponent},
      {path: 'revenue-statistics', loadChildren: ()=> RevenueStaticsModule},
      {path: 'employee-list', loadComponent: ()=> EmployeeListComponent}
    ],
  },
  {path: 'register', component:RegisterComponent},
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule{}
