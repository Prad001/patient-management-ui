import { RouterModule, Routes } from "@angular/router";
import { DoctorComponent } from "./doctor.component";
import { ReportsComponent } from "./reports/reports.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { PatientDetailsComponent } from "./patient-details/patient-details.component";
import { ScheduleComponent } from "./schedule/schedule.component";
import { AppointmentSearchComponent } from "./appointment/appointment-search/appointment-search.component";
import { SlotSearchComponent } from "./slot/slot-search/slot-search.component";
import { SlotCreateOrUpdateComponent } from "./slot/slot-create-or-update/slot-create-or-update.component";


export const doctorRoutes: Routes = [
  {
    path: "doctor",
    component: DoctorComponent,
    canActivate: [],
    children: [


      { path: "", component: DashboardComponent },
      { path: "patient-details", component: PatientDetailsComponent },
      { path: "reports", component: ReportsComponent },
      { path: "slot", component: SlotSearchComponent },
      { path: "slot/create", component: SlotCreateOrUpdateComponent, data: { create: true } },
      { path: "slot/update/:slotId", component: SlotCreateOrUpdateComponent, data: { create: false } },
      { path: "schedule", component: ScheduleComponent },
      // { path: "schedule/create", component: ScheduleCreateOrUpdateComponent, data: { create: true }},
      // { path: "schedule/update/:scheduleId", component: ScheduleCreateOrUpdateComponent, data: { create: false }},

      { path: "patient-details", component: PatientDetailsComponent },
      { path: "doctor", component: DoctorComponent },

      { path: "appointment/search", component: AppointmentSearchComponent }
    ],
  },
  { path: "doctor", component: DoctorComponent },

];

export const doctorRouter = RouterModule.forChild(doctorRoutes);