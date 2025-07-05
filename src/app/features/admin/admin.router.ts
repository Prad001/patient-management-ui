import { Routes, RouterModule } from "@angular/router";
import { AdminComponent } from "./admin.component";
import { ReceptionistSearchComponent } from "./user-management/receptionist/receptionist-search/receptionist-search.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ReportsComponent } from "./reports/reports.component";


export const adminRoutes: Routes = [
  {
    path: "admin",
    component: AdminComponent,
    canActivate: [],
    children: [
       { path: "user-management/receptionist/search", component: ReceptionistSearchComponent},
       { path: "", component: DashboardComponent},
       { path: "reports", component: ReportsComponent },
       { path: "admin", component: AdminComponent },      

    ],
  },
 { path: "admin", component: AdminComponent },

];

export const adminRouter = RouterModule.forChild(adminRoutes);
