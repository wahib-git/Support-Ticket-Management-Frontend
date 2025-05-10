import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  
  return next(req).pipe(
    catchError(error => {
      let errorMessage = 'Une erreur est survenue';
      
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Erreur: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 0:
            errorMessage = 'Impossible de se connecter au serveur';
            break;
          case 400:
            errorMessage = error.error.message || 'Requête invalide';
            break;
          case 401:
            errorMessage = 'Non autorisé. Veuillez vous reconnecter.';
            // Already handled in auth interceptor
            break;
          case 403:
            errorMessage = 'Accès interdit';
            router.navigate(['/unauthorized']);
            break;
          case 404:
            errorMessage = error.error.message || 'Ressource non trouvée';
            break;
          case 500:
            errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
            break;
          default:
            errorMessage = `${error.status}: ${error.error.message || error.statusText}`;
            break;
        }
      }
      
      toastr.error(errorMessage, 'Erreur');
      return throwError(() => error);
    })
  );
};