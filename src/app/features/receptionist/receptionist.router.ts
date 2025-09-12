import { RouterModule, Routes } from "@angular/router";
import { ReceptionistComponent } from "./receptionist.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ReportsComponent } from "./reports/reports.component";
import { PatientComponent } from "./patient/patient.component";

export const receptionistRoutes: Routes = [
    {
        path: "receptionist",
        component: ReceptionistComponent,
        canActivate: [],
        children: [


            { path: "", component: DashboardComponent },
            { path: "reports", component: ReportsComponent },
            { path: "patients", component: PatientComponent }
            // { path: "book-appointment", component: BookAppointmentComponent },
            // { path: "past-appointments", component: PastAppointmentsComponent },
            // { path: "upcoming-appointments", component: UpcomingAppointmentsComponent },

        ],
    },
    { path: "receptionist", component: ReceptionistComponent },

];

export const receptionistRouter = RouterModule.forChild(receptionistRoutes);