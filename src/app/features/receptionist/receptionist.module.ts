import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AgGridModule } from "ag-grid-angular";
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";
import { FlatpickrModule } from "angularx-flatpickr";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { SharedModule } from "src/app/shared/shared.module";
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportsComponent } from './reports/reports.component';
import { PatientComponent } from './patient/patient.component';
import { PatientCreateOrUpdateComponent } from './patient/patient-create-or-update/patient-create-or-update.component';

@NgModule({
    declarations: [
    
    DashboardComponent,
         ReportsComponent,
         PatientComponent,
         PatientCreateOrUpdateComponent
  ],
    imports: [CommonModule, SharedModule, FormsModule, AgGridModule,
        ReactiveFormsModule, NgbModalModule, FlatpickrModule.forRoot(), CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })],
    exports: [],
})
export class ReceptionistModule { }