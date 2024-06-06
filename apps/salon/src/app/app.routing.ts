import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ProductsComponent } from 'apps/salon/modules/products/products.component';
import { LayoutComponent } from 'apps/salon/layout/layout.component';

const routes: Routes = [
  {path: 'login', component:LoginComponent},
  {
    path: '', component: LayoutComponent,
    children:[
      {path: 'products', loadComponent: ()=> ProductsComponent},
    ]
   },
  // { path: '**', component: ErrorComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule{}
