import { RouterModule, Routes } from "@angular/router";
import { AdminComponent } from "./features/admin/admin.component";
import { DoctorComponent } from "./features/doctor/doctor.component";
import { AuthComponent } from "./features/auth/auth.component";
import { PatientComponent } from "./features/patient/patient.component";
import { ReceptionistComponent } from "./features/receptionist/receptionist.component";

export const router: Routes = [
  //{path: '',component:SharedComponent},
  { path: 'admin', component: AdminComponent },
  { path: 'doctor', component: DoctorComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'patient', component: PatientComponent },
  { path: 'receptionist', component: ReceptionistComponent }
];

export const routes = RouterModule.forRoot(router, { enableTracing: true });