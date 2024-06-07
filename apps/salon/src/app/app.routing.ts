import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { ProductsComponent } from './modules/products/products.component';
import { ServiceListComponent } from './modules/service-list/service-list.component';
import { CustomerListComponent } from './modules/customer-list/customer-list.component';


const routes: Routes = [
  {path: 'login', component:LoginComponent},
  {
    path: '', component: LayoutComponent,
    children:[
      {path: 'products', loadComponent: ()=> ProductsComponent},
    ],

  },
  {
    path: '', component: LayoutComponent,
    children:[
      {path: 'service-list', loadComponent: ()=> ServiceListComponent},
    ],

  },
  {
    path: '', component: LayoutComponent,
    children:[
      {path: 'customer-list', loadComponent: ()=> CustomerListComponent},
    ],

  },

  // { path: '**', component: ErrorComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule{}
