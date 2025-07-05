import { RouterModule, Routes } from "@angular/router";
import { AdminComponent } from "./features/admin/admin.component";

export const router: Routes = [
  //{path: '',component:SharedComponent},
  {path: 'admin',component:AdminComponent},
 
  
      
];

export const routes = RouterModule.forRoot(router, { enableTracing: true });