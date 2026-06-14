import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const inviteTokenGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = route.queryParamMap.get('token');

  if (!token) {
    return router.createUrlTree(['/login']);
  }

  return true;
};
