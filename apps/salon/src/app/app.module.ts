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
import { LoginComponent } from './login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TDSDataTableModule } from 'tds-ui/data-table';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { AuthGuardService } from './auth/auth-guard.service';
import { AuthorizeService } from './auth/authorize.service';
import { AppointmentListModule } from './modules/appointment-list/appointment-list.module';
import { LoadingInterceptor } from '@core/services/loading.interceptor';
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
    LoginComponent,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    TDSDataTableModule,
    RouterModule,
    AppRoutingModule,
    AppointmentListModule,
  ],
  providers: [
    { provide: TDS_I18N, useValue: vi_VN },
    AuthGuardService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
