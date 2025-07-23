import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// Loading bar modules
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminComponent } from './features/admin/admin.component';
import { AdminModule } from './features/admin/admin.module';
import { adminRouter } from './features/admin/admin.router';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { DoctorComponent } from './features/doctor/doctor.component';
import { doctorRouter } from './features/doctor/doctor.router';
import { DoctorModule } from './features/doctor/doctor.module';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';


@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    DoctorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    AdminModule,
    adminRouter,
    AgGridAngular,
    AgGridModule,
    MatDialogModule,
    HttpClientModule,
    doctorRouter,
    DoctorModule,
    LoadingBarModule,
    LoadingBarHttpClientModule,
    LoadingBarRouterModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
     FlatpickrModule.forRoot(),
  ],
 providers: [
        
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
function provideAnimationsAsync(): import("@angular/core").Provider | import("@angular/core").EnvironmentProviders {
  throw new Error('Function not implemented.');
}

