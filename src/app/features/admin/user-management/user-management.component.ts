import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    
  ],
  template: `
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2>Gestion des utilisateurs</h2>
        </div>
        
      
        <div class="card">
          <div class="card-body">
            <div class="mb-3">
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-search"></i></span>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Rechercher..."
                  (input)="onSearch($event)"
                />
              </div>
            </div>
            
            <div *ngIf="!isLoading && filteredUsers.length === 0" class="text-center py-4">
              <p class="text-muted">Aucun utilisateur trouvé</p>
            </div>
            
            <div *ngIf="!isLoading && filteredUsers.length > 0" class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Spécialisation</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let user of filteredUsers">
                    <td>{{ user.name }}</td>
                    <td>{{ user.email }}</td>
                    <td>
                      <span class="badge" [ngClass]="getRoleBadgeClass(user.role)">
                        {{ user.role | titlecase }}
                      </span>
                    </td>
                    <td>{{ user.specialization || '-' }}</td>
                    <td>
                      <div class="d-flex gap-2">
        
                        <button class="btn btn-sm btn-outline-danger" (click)="deleteUser(user._id)">
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  isLoading = false;
  selectedUserId = '';
  searchTerm = '';

  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }
  loadUsers(): void {
    this.isLoading = true;
    
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = [...users];
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Erreur lors du chargement des utilisateurs');
        this.isLoading = false;
      }
    });
  }
  deleteUser(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.isLoading = true;
      
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.toastr.success('Utilisateur supprimé avec succès');
          this.loadUsers();
        },
        error: () => {
          this.toastr.error('Erreur lors de la suppression de l\'utilisateur');
          this.isLoading = false;
        }
      });
    }
  }
  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    
    this.filteredUsers = this.users.filter(user => 
      user.name.toLowerCase().includes(this.searchTerm) ||
      user.email.toLowerCase().includes(this.searchTerm) ||
      user.role.toLowerCase().includes(this.searchTerm) ||
      (user.specialization && user.specialization.toLowerCase().includes(this.searchTerm))
    );
  }

  getRoleBadgeClass(role: string): string {
    switch(role) {
      case 'admin': return 'bg-danger';
      case 'agent': return 'bg-success';
      case 'interlocuteur': return 'bg-info text-dark';
      default: return 'bg-secondary';
    }
  }
}