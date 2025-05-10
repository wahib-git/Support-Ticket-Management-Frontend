import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  roles: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar d-flex flex-column px-3 py-4">
      <div class="text-center mb-4">
        <h5 class="fw-bold mb-0">Support Scolaire</h5>
        <small class="text-muted">{{ role | titlecase }}</small>
      </div>
      
      <hr>
      
      <ul class="nav flex-column">
        <li class="nav-item" *ngFor="let item of navItems">
          <a 
            class="nav-link py-2 px-3 d-flex align-items-center" 
            [routerLink]="item.route"
            routerLinkActive="active"
          >
            <i class="bi {{ item.icon }} me-2"></i>
            {{ item.label }}
          </a>
        </li>
      </ul>
      
      <div class="mt-auto">
        <hr>
        <div class="d-flex align-items-center mb-3">
          <button class="btn btn-sm btn-outline-secondary" (click)="logout()">
            <i class="bi bi-box-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class SidebarComponent implements OnInit {
  @Input() role: string = '';
  navItems: NavItem[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getRole().subscribe({
      next: (role) => {
        if (role) {
          this.role = role; // Met à jour le rôle
          this.setupNavItems(role);
        } else {
          console.error('Failed to fetch user role.');
        }
      },
      error: (err) => {
        console.error('Error fetching user role:', err);
      }
    });
  }

  setupNavItems(role: string): void {
    switch (role) {
      case 'admin':
        this.navItems = [
          { label: 'Tableau de bord', route: '/admin/dashboard', icon: 'bi-speedometer2', roles: ['admin'] },
          { label: 'Utilisateurs', route: '/admin/users', icon: 'bi-people', roles: ['admin'] },
          { label: 'Tickets', route: '/admin/tickets', icon: 'bi-ticket', roles: ['admin'] }
        ];
        break;
      case 'agent':
        this.navItems = [
          { label: 'Mes tickets', route: '/agent/tickets', icon: 'bi-ticket', roles: ['agent'] },
          { label: 'Profil', route: '/agent/profile', icon: 'bi-person', roles: ['agent'] }
        ];
        break;
      case 'interlocuteur':
        this.navItems = [
          { label: 'Mes tickets', route: '/interlocuteur/tickets', icon: 'bi-ticket', roles: ['interlocuteur'] },
          { label: 'Nouveau ticket', route: '/interlocuteur/tickets/create', icon: 'bi-plus-circle', roles: ['interlocuteur'] },
          { label: 'Profil', route: '/interlocuteur/profile', icon: 'bi-person', roles: ['interlocuteur'] }
        ];
        break;
      default:
        console.error('Unknown role:', role);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}