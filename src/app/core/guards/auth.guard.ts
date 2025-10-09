import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from 'src/types/JwtPayload';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const user = localStorage.getItem('user') || sessionStorage.getItem('user');

  console.log('AuthGuard triggered for route:', state.url);

  // 1️⃣ No token/user → redirect
  if (!token || !user) {
    console.warn('No token or user found. Redirecting to /auth');
    router.navigate(['/auth/login']);
    return false;
  }

  try {
    // 2️⃣ Decode & check expiry
    const decoded = jwtDecode<JwtPayload>(token);
    const isExpired = decoded.exp && decoded.exp * 1000 < Date.now();

    if (isExpired) {
      console.warn('Token expired. Redirecting to /auth');
      clearAuthData();
      router.navigate(['/auth']);
      return false;
    }

    // 3️⃣ Role check
    const { role } = JSON.parse(user);
    const allowedRoles = route.data['roles'] as string[];

    console.log('Allowed roles:', allowedRoles, 'User role:', role);

    if (!allowedRoles || allowedRoles.includes(role)) {
      console.log('Access granted');
      return true;
    }

    // 4️⃣ Role mismatch
    console.warn('Access denied. Redirecting to /unauthorized');
    router.navigate(['/unauthorized']);
    return false;

  } catch (err) {
    console.error('Token decode error:', err);
    clearAuthData();
    router.navigate(['/auth']);
    return false;
  }
};

function clearAuthData() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
}
