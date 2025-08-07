import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { AuthComponent } from "./auth.component";
import { SignupComponent } from "./signup/signup.component";

export const authRoutes: Routes = [
    {
        path: "auth",
        component: AuthComponent,
        canActivate: [],
        children: [
            {
                path: "login",
                component: LoginComponent
            },
            {
                path: "signup",
                component: SignupComponent
            }
        ]
    },
    { path: "auth", component: AuthComponent }
];

export const authRouter = RouterModule.forChild(authRoutes);