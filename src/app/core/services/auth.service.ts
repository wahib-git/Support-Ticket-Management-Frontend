import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginCredentials, RegisterData } from '../models/user.model';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private tokenKey = environment.tokenKey;

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response.token) {
          console.log('Login response:', response);
          console.log('Saving token to localStorage:', response.token);
          localStorage.setItem(this.tokenKey, response.token); // Enregistre le token
        } else {
          console.error('Token is missing in the response.');
        }
        }),
        catchError(error => {
          return throwError(() => new Error(error.error.message || 'Failed to login'));
        })
      );
  }

  register(userData: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, userData)
      .pipe(
        tap(response => {
          localStorage.setItem(this.tokenKey, response.token);        }),
        catchError(error => {
          return throwError(() => new Error(error.error.message || 'Failed to register'));
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const decodedToken: any = jwtDecode(token);
      const isExpired = decodedToken.exp < Date.now() / 1000;
      return !isExpired;
    } catch (error) {
      return false;
    }
  }
  getRole(): Observable<string | null> {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode<{ role: string }>(token);
        return of(decodedToken.role); // Retourne un Observable contenant le rôle
      } catch (error) {
        console.error('Failed to decode token:', error);
        return of(null); // Retourne un Observable contenant `null` en cas d'erreur
      }
    }
    return of(null); // Retourne un Observable contenant `null` si aucun token n'est présent
  }
  getUserId(){
    const token = this.getToken();
    if(token){
      const decodedToken = jwtDecode<any>(token);
      const id = decodedToken._id;
      return id;
    }
  }
 
    

  redirectBasedOnRole(): void {
    this.getRole().subscribe(role => {
      console.log('Redirecting based on role:', role);

      if (role === 'admin') {
        this.router.navigate(['/admin/dashboard']);
      } else if (role === 'agent') {
        this.router.navigate(['/agent/tickets']);
      } else if (role === 'interlocuteur') {
        this.router.navigate(['/interlocuteur/tickets']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  
}