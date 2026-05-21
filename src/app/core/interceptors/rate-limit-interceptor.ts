import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, throwError } from 'rxjs';
import { RateLimitErrorModal } from '../../components/rate-limit-error-modal/rate-limit-error-modal';

export const rateLimitInterceptor: HttpInterceptorFn = (req, next) => {
  const modal = inject(NgbModal)
  console.log('RATE LIMIT INTERCEPTOR IS RUNNING')

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 429 && !modal.hasOpenModals()) {
        const modalRef = modal.open(RateLimitErrorModal, {
          centered: true,
        })
        const retryAfter = Number(error.headers.get('Retry-After')) || 60;
        modalRef.componentInstance.secondsLeft = retryAfter;
      }
      return throwError(() => error);
    })
  )
};
