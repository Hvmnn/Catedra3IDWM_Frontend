import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const router = inject(Router);

  let modifiedRequest = req;
  if(token) {
    modifiedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  return next(modifiedRequest).pipe(
    tap((event) => {
      if (event instanceof HttpResponse && event.body && typeof event.body === 'object' && 'token' in event.body) {
        const newToken = event.body.token;
        if (typeof newToken === 'string') {
          authService.setToken(newToken);
        }
      }
    }),

    catchError ((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.clearToken();
        router.navigate(['/login'], { queryParams: { message: 'Sesión expirada' } });
      }
      return throwError(() => error);
    })
  );
};
