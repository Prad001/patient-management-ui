import { RouterModule, Routes } from "@angular/router";
import { ReceptionistComponent } from "./receptionist.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ReportsComponent } from "./reports/reports.component";
// import { PatientComponent } from "./patient/patient.component";
import { PatientCreateOrUpdateComponent } from "./patient/patient-create-or-update/patient-create-or-update.component";
import { PatientSearchComponent } from "./patient/patient-search/patient-search.component";

export const receptionistRoutes: Routes = [
    {
        path: "receptionist",
        component: ReceptionistComponent,
        canActivate: [],
        children: [


            { path: "", component: DashboardComponent },
            { path: "reports", component: ReportsComponent },
            // { path: "patients", component: PatientComponent },
            { path: "patients/create", component: PatientCreateOrUpdateComponent, data: { create: true } },
            { path: "patients/update/:patientId", component: PatientCreateOrUpdateComponent, data: { create: false } },
            { path: "patients/search", component: PatientSearchComponent }
            // { path: "book-appointment", component: BookAppointmentComponent },
            // { path: "past-appointments", component: PastAppointmentsComponent },
            // { path: "upcoming-appointments", component: UpcomingAppointmentsComponent },

        ],
    },
    { path: "receptionist", component: ReceptionistComponent },

];

export const receptionistRouter = RouterModule.forChild(receptionistRoutes);