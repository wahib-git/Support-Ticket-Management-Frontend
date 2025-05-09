import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Default route
  { 
    path: '', 
    redirectTo: '/login', 
    pathMatch: 'full' 
  },
  
  // Auth routes
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  
  // Admin routes
  {
    path: 'admin',
    loadComponent: () => import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [AuthGuard],
    data: { role: 'admin' },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/admin/user-management/user-management.component').then(m => m.UserManagementComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  
  // Agent routes
  {
    path: 'agent',
    loadComponent: () => import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [AuthGuard],
    data: { role: 'agent' },
    children: [
      {
        path: 'tickets',
        loadComponent: () => import('./features/agent/agent-ticket-list/agent-ticket-list.component').then(m => m.AgentTicketListComponent)
      },
      {
        path: '',
        redirectTo: 'tickets',
        pathMatch: 'full'
      }
    ]
  },
  
  // interlocuteur routes
  {
    path: 'interlocuteur',
    loadComponent: () => import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [AuthGuard],
    data: { role: 'interlocuteur' },
    children: [
      {
        path: 'tickets',
        loadComponent: () => import('./features/teacher/ticket-list/ticket-list.component').then(m => m.TicketListComponent)
      },
      {
        path: 'tickets/create',
        loadComponent: () => import('./features/teacher/ticket-form/ticket-form.component').then(m => m.TicketFormComponent)
      },
      {
        path: '',
        redirectTo: 'tickets',
        pathMatch: 'full'
      }
    ]
  },
  
  // Catch-all route for undefined paths
  {
    path: '**',
    redirectTo: '/login'
  }
];