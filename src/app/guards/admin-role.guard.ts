import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';


export const AdminRoleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const userId = sessionStorage.getItem('user-id');
  const userRole = sessionStorage.getItem('user-role');

  if (userRole === 'admin') {
    return true;
  } else {
    alert('You do not have permission to access this page.');
    router.navigate(['/client-dashboard', userId]);
    return false;
  }
}
