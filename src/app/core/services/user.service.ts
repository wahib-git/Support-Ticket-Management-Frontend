import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User, RegisterData } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Get all users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl)
      .pipe(
        tap(users => this.usersSubject.next(users))
      );
  }

  // Get users by role
  getUsersByRole(role: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/role/${role}`);
  }

  // Get a single user by ID
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // Create a user (admin functionality)
  createUser(userData: RegisterData): Observable<User> {
    return this.http.post<User>(this.apiUrl, userData)
      .pipe(
        tap(newUser => {
          const currentUsers = this.usersSubject.value;
          this.usersSubject.next([...currentUsers, newUser]);
        })
      );
  }

  // Update a user
  updateUser(id: string, userData: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, userData)
      .pipe(
        tap(updatedUser => {
          const currentUsers = this.usersSubject.value;
          const updatedUsers = currentUsers.map(user => 
            user._id === id ? updatedUser : user
          );
          this.usersSubject.next(updatedUsers);
        })
      );
  }

  // Delete a user
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => {
          const currentUsers = this.usersSubject.value;
          const filteredUsers = currentUsers.filter(user => user._id !== id);
          this.usersSubject.next(filteredUsers);
        })
      );
  }

  // Get agents by specialization
  getAgentsBySpecialization(specialization: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/agents/${specialization}`);
  }
}