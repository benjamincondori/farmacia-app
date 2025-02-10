import { 
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const router = inject(Router);
  
  // Obtener el token del sessionStorage
  const token = sessionStorage.getItem('token');
  
  if (token) {
    // Clonar la request y agregar el token en el header
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token expirado o inválido
        console.log('Token expirado o inválido');
        
        // Limpiar sessionStorage
        sessionStorage.clear();
        
        // Redirigir al login
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
};
