import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token-service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const tokenService = inject(TokenService)
  const role = tokenService.getRole()
  const token = tokenService.getToken()

  if (token && (role === 'owner' || role === 'admin')) {
    return router.createUrlTree(['/admin'])
  }

  if (token && role === 'cashier') {
    return router.createUrlTree(['/expenses'])
  }

  return true;
};
