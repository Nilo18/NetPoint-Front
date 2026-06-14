import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token-service';

export const basicGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const tokenService = inject(TokenService)
  
  if (!tokenService.getToken()) {
    return router.createUrlTree(['/login'])
  }

  return true;
};
