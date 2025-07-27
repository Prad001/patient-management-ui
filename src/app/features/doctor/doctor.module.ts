import { NgModule } from "@angular/core";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ReportsComponent } from "./reports/reports.component";
import { PatientDetailsComponent } from "./patient-details/patient-details.component";
import { SlotComponent } from "./slot/slot.component";
import { ScheduleComponent } from './schedule/schedule.component';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarModule, DateAdapter } from "angular-calendar";
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';
import { ScheduleCreateOrUpdateComponent } from './schedule/schedule-create-or-update/schedule-create-or-update.component';
import { ScheduleSearchComponent } from './schedule/schedule-search/schedule-search.component';
import { AppointmentSearchComponent } from './appointment/appointment-search/appointment-search.component';
import { AgGridModule } from "ag-grid-angular";
import { SlotSelectDialogComponent } from "./schedule/slot-select-dialog/slot-select-dialog.component";

@NgModule({
  declarations: [
    AppointmentSearchComponent,
    DashboardComponent,
    ReportsComponent,
    PatientDetailsComponent,
    SlotComponent,
    ScheduleComponent,
    ScheduleCreateOrUpdateComponent,
    ScheduleSearchComponent,
    AppointmentSearchComponent,
    SlotSelectDialogComponent

  ],
  imports: [CommonModule, SharedModule, FormsModule, AgGridModule,
    ReactiveFormsModule, NgbModalModule, FlatpickrModule.forRoot(), CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })],
  exports: [],
})
export class DoctorModule { }