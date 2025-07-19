import { RouterModule, Routes } from "@angular/router";
import { AdminComponent } from "./features/admin/admin.component";
import { DoctorComponent } from "./features/doctor/doctor.component";

export const router: Routes = [
  //{path: '',component:SharedComponent},
  {path: 'admin',component:AdminComponent},
  {path: 'doctor',component:DoctorComponent},
 
  
      
];

export const routes = RouterModule.forRoot(router, { enableTracing: true });