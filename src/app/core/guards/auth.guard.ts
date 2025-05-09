import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router 
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    const requiredRole = route.data['role'] as string | string[];
    if (!requiredRole) {
      return true; // Si aucun rôle requis, autorise l'accès
    }

    return this.authService.getRole().pipe(
      take(1),
      map(role => {
        const normalizedRole = role ?? undefined; // Convert null to undefined
        console.log('Role in AuthGuard:', role); // Log du rôle

        if (this.checkRole(normalizedRole, requiredRole)) {
          return true; // Autorise l'accès si le rôle correspond
        } else {
          console.log('Unauthorized access, redirecting to /unauthorized');
          this.router.navigate(['/unauthorized']); // Redirige si le rôle ne correspond pas
          return false;
        }
      }),
      catchError(() => {
        console.log('Error in AuthGuard, redirecting to /unauthorized');
        this.router.navigate(['/unauthorized']); // Redirige en cas d'erreur
        return of(false);
      })
    );
  }

  private checkRole(userRole: string | undefined, requiredRole: string | string[]): boolean {
    const hasAccess = Array.isArray(requiredRole)
      ? requiredRole.includes(userRole || '')
      : userRole === requiredRole;

    return hasAccess;
  }
}