import { RouterModule, Routes } from "@angular/router";
import { AdminComponent } from "./features/admin/admin.component";
import { DoctorComponent } from "./features/doctor/doctor.component";
import { AuthComponent } from "./features/auth/auth.component";
import { PatientComponent } from "./features/patient/patient.component";
import { AuthGuard } from "./core/guards/auth.guard";

export const router: Routes = [
  { path: 'auth', component: AuthComponent },

  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'doctor', component: DoctorComponent, canActivate: [AuthGuard], data: { roles: ['DOCTOR'] } },
  { path: 'patient', component: PatientComponent, canActivate: [AuthGuard], data: { roles: ['PATIENT'] } },

  { path: '**', redirectTo: 'auth' }
];

export const routes = RouterModule.forRoot(router, { enableTracing: false });
