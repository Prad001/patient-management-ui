import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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


@NgModule({
  declarations: [
    AppComponent,
    AdminComponent
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
    HttpClientModule
  ],
 providers: [
        
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
function provideAnimationsAsync(): import("@angular/core").Provider | import("@angular/core").EnvironmentProviders {
  throw new Error('Function not implemented.');
}

