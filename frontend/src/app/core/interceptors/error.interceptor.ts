import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const toast = inject(ToastService);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      const message = error.error?.title
        ?? (error.status >= 500
          ? 'Something went wrong on the server.'
          : 'Request failed. Please try again.');

      toast.error(message);
      return throwError(() => error);
    })
  );
};
