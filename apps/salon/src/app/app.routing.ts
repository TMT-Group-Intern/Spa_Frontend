import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceListComponent } from './modules/service-list/service-list.component';
import { LoginComponent } from './login/login.component';
import { ProductsComponent } from './modules/products/products.component';
import { LayoutComponent } from './layout/layout.component'; 
import { CustomerListComponent } from './modules/customer-list/customer-list.component';
import { RegisterComponent } from './register/register.component';
import { RevenueStaticsModule } from './modules/revenue-statistics/revenue-statistics.module';

const routes: Routes = [
  {path: 'login', component:LoginComponent},
  {
    path: '', component: LayoutComponent,
    children:[
      {path: 'products', loadComponent: ()=> ProductsComponent},
    ]
   },
   {
    path: '', component: LayoutComponent,
    children:[
      {path: 'service-list', loadComponent: ()=> ServiceListComponent},
      {path: 'customer-list', loadComponent: ()=> CustomerListComponent},
      {path: 'revenue-statistics', loadChildren: ()=> RevenueStaticsModule},
    ],
  },
   {path:'register', component:RegisterComponent},
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule{}
