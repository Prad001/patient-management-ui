import { RouterModule, Routes } from "@angular/router";
import { DoctorComponent } from "./doctor.component";
import { ReportsComponent } from "./reports/reports.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { SlotComponent } from "./slot/slot.component";
import { PatientDetailsComponent } from "./patient-details/patient-details.component";
import { ScheduleComponent } from "./schedule/schedule.component";
import { AppointmentSearchComponent } from "./appointment/appointment-search/appointment-search.component";


export const doctorRoutes: Routes = [
  {
    path: "doctor",
    component: DoctorComponent,
    canActivate: [],
    children: [


      { path: "", component: DashboardComponent },

      { path: "reports", component: ReportsComponent },

      { path: "slot", component: SlotComponent },

      { path: "schedule", component: ScheduleComponent },

      { path: "patient-details", component: PatientDetailsComponent },

      { path: "doctor", component: DoctorComponent },

      { path: "appointment/search", component: AppointmentSearchComponent }
    ],
  },
  { path: "doctor", component: DoctorComponent },

];

export const doctorRouter = RouterModule.forChild(doctorRoutes);