import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

export const OwnerGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const router = inject(Router);

  const userId = sessionStorage.getItem('user-id');
  const ownerId = route.paramMap.get('owner_id');

  if (userId === ownerId) {
    return true;
  } else {
    alert('You do not have permission to access this page.');
    router.navigate(['/dashboard', userId]);
    return false;
  }
};

