import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token-service';
import { jwtDecode } from 'jwt-decode';

export const settingsPageGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService)
  const router = inject(Router)
  const token = tokenService.getToken()

  if (!token) {
    return router.createUrlTree(['/login']);
  }

  return true;
};


export const settingsChildGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService)
  const router = inject(Router)

  const decodedToken = tokenService.getDecodedToken()
  const role = decodedToken?.role.trim().toLowerCase()
  const childPath = route.routeConfig?.path

  if (childPath === 'personal-info') {
    return true
  }

  if (role === 'owner') {
    return true
  }

  return router.createUrlTree(['/settings/personal-info']);
}