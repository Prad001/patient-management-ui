import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from 'src/types/JwtPayload';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');

    // 1️⃣ Check if token and user exist
    if (!token || !user) {
      this.router.navigate(['/auth']);
      return false;
    }

    try {
      // 2️⃣ Decode and verify token expiry
      const decoded = jwtDecode<JwtPayload>(token);
      const isExpired = decoded.exp && decoded.exp * 1000 < Date.now();

      if (isExpired) {
        this.clearAuthData();
        this.router.navigate(['/auth']);
        return false;
      }

      // 3️⃣ Verify role-based access
      const { role } = JSON.parse(user);
      const allowedRoles = route.data['roles'] as string[];

      if (!allowedRoles || allowedRoles.includes(role)) {
        return true;
      }

      // 4️⃣ Role mismatch → unauthorized
      this.router.navigate(['/unauthorized']);
      return false;

    } catch (error) {
      // 5️⃣ Invalid or corrupted token
      console.error('Token decode error:', error);
      this.clearAuthData();
      this.router.navigate(['/auth']);
      return false;
    }
  }

  // 🔧 Helper method to clear all auth data
  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  }
}
