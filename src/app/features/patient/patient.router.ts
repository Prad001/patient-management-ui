import { RouterModule, Routes } from "@angular/router";
import { PatientComponent } from "./patient.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ReportsComponent } from "./reports/reports.component";
import { PastAppointmentsComponent } from "./appointment/past-appointments/past-appointments.component";
import { UpcomingAppointmentsComponent } from "./appointment/upcoming-appointments/upcoming-appointments.component";
import { BookAppointmentComponent } from "./appointment/book-appointment/book-appointment.component";
import { DoctorAvailabilityComponent } from "./appointment/book-appointment/doctor-availability/doctor-availability.component";

export const patientRoutes: Routes = [
  {
    path: "patient",
    component: PatientComponent,
    canActivate: [],
    children: [


      { path: "", component: DashboardComponent },
      { path: "reports", component: ReportsComponent },
      { path: "book-appointment", component: BookAppointmentComponent },
      { path: "book-appointment/check-availability", component: DoctorAvailabilityComponent },
      { path: "past-appointments", component: PastAppointmentsComponent },
      { path: "upcoming-appointments", component: UpcomingAppointmentsComponent },
     
    ],
  },
  { path: "patient", component: PatientComponent },

];

export const patientRouter = RouterModule.forChild(patientRoutes);