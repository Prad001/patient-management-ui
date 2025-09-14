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
import { BookAppointmentComponent } from './appointment/book-appointment/book-appointment.component';
import { UpcomingAppointmentsComponent } from './appointment/upcoming-appointments/upcoming-appointments.component';
import { PastAppointmentsComponent } from './appointment/past-appointments/past-appointments.component';
import { DoctorAvailabilityComponent } from './appointment/book-appointment/doctor-availability/doctor-availability.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppointmentDialogComponent } from "./appointment/book-appointment/doctor-availability/appointment-dialog/appointment-dialog.component";
import { SuccessDialogComponent } from "./shared/dialogs/success-dialog/success-dialog.component";
import { DeleteDialogComponent } from "./shared/dialogs/delete-dialog/delete-dialog.component";

@NgModule({
  declarations: [
   DashboardComponent,
   ReportsComponent,
   BookAppointmentComponent,
   UpcomingAppointmentsComponent,
   PastAppointmentsComponent,
   DoctorAvailabilityComponent,
   AppointmentDialogComponent,
   DeleteDialogComponent,
   SuccessDialogComponent

  ],
  imports: [CommonModule, SharedModule, FormsModule, AgGridModule,MatSnackBarModule,
    ReactiveFormsModule, NgbModalModule, FlatpickrModule.forRoot(), CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })],
  exports: [],
})
export class PatientModule { }