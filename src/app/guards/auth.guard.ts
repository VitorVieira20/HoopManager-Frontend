import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);

  const authToken = sessionStorage.getItem('auth-token');

  if (authToken) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
