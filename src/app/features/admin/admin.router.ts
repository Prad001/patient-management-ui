import { Routes, RouterModule } from "@angular/router";
import { AdminComponent } from "./admin.component";
import { ReceptionistSearchComponent } from "./user-management/receptionist/receptionist-search/receptionist-search.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ReportsComponent } from "./reports/reports.component";
import { ReceptionistCreateOrUpdateComponent } from "./user-management/receptionist/receptionist-create-or-update/receptionist-create-or-update.component";
import { DoctorSearchComponent } from "./user-management/doctor/doctor-search/doctor-search.component";
import { DoctorCreateOrUpdateComponent } from "./user-management/doctor/doctor-create-or-update/doctor-create-or-update.component";


export const adminRoutes: Routes = [
  {
    path: "admin",
    component: AdminComponent,
    canActivate: [],
    children: [
      { path: "user-management/receptionist/search", component: ReceptionistSearchComponent },
      { path: "user-management/receptionist/create", component: ReceptionistCreateOrUpdateComponent, data: { create: true } },
      { path: "user-management/receptionist/update/:receptionistId", component: ReceptionistCreateOrUpdateComponent, data: { create: false } },

      { path: "user-management/doctor/search", component: DoctorSearchComponent },
      { path: "user-management/doctor/create", component: DoctorCreateOrUpdateComponent, data: { create: true } },
      { path: "user-management/doctor/update/:doctorId", component: DoctorCreateOrUpdateComponent, data: { create: false } },

      { path: "", component: DashboardComponent },
      { path: "reports", component: ReportsComponent },
      { path: "admin", component: AdminComponent },
    ],
  },
  { path: "admin", component: AdminComponent },

];

export const adminRouter = RouterModule.forChild(adminRoutes);
