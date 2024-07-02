import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceListComponent } from './modules/service-list/service-list.component';
import { LoginComponent } from './login/login.component';
import { ProductsComponent } from './modules/products/products.component';
import { LayoutComponent } from './layout/layout.component'; 
import { CustomerListComponent } from './modules/customer-list/customer-list.component';
import { RevenueStaticsModule } from './modules/revenue-statistics/revenue-statistics.module';
import { HomeComponent } from './modules/home/home.component';
import { UsersComponent } from './modules/users/users.component';

const routes: Routes = [
  {path: '', component:LoginComponent},
  {
    path: '', component: LayoutComponent,
    children:[
      {path: 'home', loadComponent: ()=> HomeComponent},
      {path: 'products', loadComponent: ()=> ProductsComponent},
      {path: 'service-list', loadComponent: ()=> ServiceListComponent},
      {path: 'customer-list', loadComponent: ()=> CustomerListComponent},
      {path: 'revenue-statistics', loadChildren: ()=> RevenueStaticsModule},
      {path: 'users', loadComponent: ()=> UsersComponent}
    ]
   },
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  
})

export class AppRoutingModule{}
