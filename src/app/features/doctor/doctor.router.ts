import { RouterModule, Routes } from "@angular/router";
import { DoctorComponent } from "./doctor.component";
import { ReportsComponent } from "./reports/reports.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AppointmentComponent } from "./appointment/appointment.component";
import { SlotComponent } from "./slot/slot.component";
import { PatientDetailsComponent } from "./patient-details/patient-details.component";
import { ScheduleComponent } from "./schedule/schedule.component";


export const doctorRoutes: Routes = [
  {
    path: "doctor",
    component: DoctorComponent,
    canActivate: [],
    children: [
      

      { path: "", component: DashboardComponent },
      { path: "reports", component: ReportsComponent },
      { path: "appointment", component: AppointmentComponent},
      { path: "slot", component: SlotComponent },
      { path: "schedule", component: ScheduleComponent },
      // { path: "schedule/create", component: ScheduleCreateOrUpdateComponent, data: { create: true }},
      // { path: "schedule/update/:scheduleId", component: ScheduleCreateOrUpdateComponent, data: { create: false }},

      { path: "patient-details", component: PatientDetailsComponent},
      { path: "doctor", component: DoctorComponent },
    ],
  },
  { path: "doctor", component: DoctorComponent },

];

export const doctorRouter = RouterModule.forChild(doctorRoutes);