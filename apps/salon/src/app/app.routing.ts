import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceListComponent } from './modules/service-list/service-list.component';
import { LoginComponent } from './login/login.component';
import { ProductsComponent } from './modules/products/products.component';
import { LayoutComponent } from './layout/layout.component'; 
import { RegisterComponent } from './register/register.component';
import { CustomerListComponent } from './modules/customer-list/customer-list.component';
import { RevenueStatisticsComponent } from './modules/revenue-statistics/revenue-statistics.component';

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
    ],

  },

  {
    path: '', component: LayoutComponent,
    children:[
      {path: 'customer-list', loadComponent: ()=> CustomerListComponent},
    ],

  },
  {
    path: '', component: LayoutComponent,
    children:[
      {path: 'revenue-statics', loadComponent: ()=> RevenueStatisticsComponent},
    ]

  },

   {path:'register', component:RegisterComponent},
  // { path: '**', component: ErrorComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule{}
