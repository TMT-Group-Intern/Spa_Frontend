import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TDS_I18N, vi_VN } from 'tds-ui/i18n';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DragDropModule } from '@angular/cdk/drag-drop';
// Đa ngôn ngữ
import localeVi from '@angular/common/locales/vi';
import { registerLocaleData } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TDSButtonModule } from 'tds-ui/button';
import { TDSButtonMenuModule } from 'tds-ui/button-menu';
import { HomeComponent } from './home/home/home.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { TDSDataTableModule } from 'tds-ui/data-table';
import { ServiceListComponent } from './service-list/service-list.component';
import { MenuComponent } from './shared/menu/menu.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { RegisterComponent } from './register/register.component';
registerLocaleData(localeVi);
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DragDropModule,
    ScrollingModule,
    TDSButtonModule,
    TDSButtonMenuModule,
    HomeComponent,
    LoginComponent,
    HttpClientModule,
    MenuComponent,
    RouterModule,
    AppRoutingModule,
    SidebarComponent,
    HeaderComponent,
    CustomerListComponent,
    TDSDataTableModule,
    ServiceListComponent,
    MenuComponent,
    RouterModule,
    AppRoutingModule,
    RegisterComponent,
  ],
  providers: [{ provide: TDS_I18N, useValue: vi_VN }],
  bootstrap: [AppComponent],
})
export class AppModule {}
