import { RouterModule, Routes } from "@angular/router";
import { ReceptionistComponent } from "./receptionist.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ReportsComponent } from "./reports/reports.component";
// import { PatientComponent } from "./patient/patient.component";
import { PatientCreateOrUpdateComponent } from "./patient/patient-create-or-update/patient-create-or-update.component";
import { PatientSearchComponent } from "./patient/patient-search/patient-search.component";
import { DoctorAvailabilityComponent } from "./patient/book-appointment/doctor-availability/doctor-availability.component";
import { BookAppointmentComponent } from "./patient/book-appointment/book-appointment.component";
import { PastAppointmentsComponent } from "./patient/past-appointments/past-appointments.component";
import { UpcomingAppointmentsComponent } from "./patient/upcoming-appointments/upcoming-appointments.component";
import { authGuard } from "src/app/core/guards/auth.guard";

export const receptionistRoutes: Routes = [
    {
        path: "receptionist",
        component: ReceptionistComponent,
        canActivate: [authGuard],
        data: { roles: ['RECEPTIONIST'] },
        children: [


            { path: "", component: DashboardComponent },
            { path: "reports", component: ReportsComponent },
            // { path: "patients", component: PatientComponent },
            { path: "patients/create", component: PatientCreateOrUpdateComponent, data: { create: true } },
            { path: "patients/update/:patientId", component: PatientCreateOrUpdateComponent, data: { create: false } },
            { path: "patients/search", component: PatientSearchComponent },
            { path: "patients/search/book-appointment/:patientId", component: BookAppointmentComponent },
            { path: "patients/search/book-appointment/check-availability/:doctorId", component: DoctorAvailabilityComponent },
            { path: "patients/past-appointments", component: PastAppointmentsComponent },
            { path: "patients/upcoming-appointments", component: UpcomingAppointmentsComponent },
            // { path: "book-appointment", component: BookAppointmentComponent },
            // { path: "past-appointments", component: PastAppointmentsComponent },
            // { path: "upcoming-appointments", component: UpcomingAppointmentsComponent },

        ],
    },
    { path: "receptionist", component: ReceptionistComponent },

];

export const receptionistRouter = RouterModule.forChild(receptionistRoutes);