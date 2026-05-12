import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { TokenService } from '../services/token-service';
import { inject } from '@angular/core';

export const adminDashboardGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService)
  const router = inject(Router)
  const token = tokenService.getToken()

  if (!token) {
    router.navigate(['/login'])
    return false
  }

  const decodedToken: any = jwtDecode(token)
  const stdDecodedToken = decodedToken.role.trim().toLowerCase()

  if (stdDecodedToken === 'cashier') {
    router.navigate(['/expenses'])
    return false
  }

  return true;
};
