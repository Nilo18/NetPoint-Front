import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../../services/token-service';
import { throwError } from 'rxjs';
import { BackendUrlHolderService } from '../../services/backend-url-holder-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('authInterceptor is running...')
  const backendUrlHolder = inject(BackendUrlHolderService)

  const publicUrls = [
    `${backendUrlHolder.getBaseUrl()}/auth/login`, `${backendUrlHolder.getBaseUrl()}/auth/signup`, 
    `/setup-account`, `${backendUrlHolder.getBaseUrl()}/auth/verify-2fa`
  ]

  const isPublic = publicUrls.some(url => {
    // console.log('req.url is: ', req.url)
    // console.log('being compared to: ', url)
    return req.url.includes(url)
  })

  if (isPublic) {
    // console.log('Public url detected, skipping token check')
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
