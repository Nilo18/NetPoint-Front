import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../../services/token-service';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('authInterceptor is running...')
  const publicUrls = ['/login', '/signup', '/setup-account']

  const isPublic = publicUrls.some(url => req.url.includes(url))

  if (isPublic) {
    console.log('Public url detected, skipping token check')
    return next(req)
  }

  const tokenService = inject(TokenService)
  const token = tokenService.getToken()

  if (!token) {
    return throwError(() => new Error('No auth token - request blocked'))
  }

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  })

  return next(authReq);
};
