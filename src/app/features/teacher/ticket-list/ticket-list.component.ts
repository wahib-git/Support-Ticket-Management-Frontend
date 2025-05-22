import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TicketService } from '../../../core/services/ticket.service';
import { AuthService } from '../../../core/services/auth.service';
import { Ticket } from '../../../core/models/ticket.model';
import { ToastrService } from 'ngx-toastr';
import { TicketStatusBadgeComponent } from '../../../shared/components/ticket-status-badge/ticket-status-badge.component';
import { TicketPriorityBadgeComponent } from '../../../shared/components/ticket-priority-badge/ticket-priority-badge.component';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TicketStatusBadgeComponent,
    TicketPriorityBadgeComponent
  ],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Mes tickets</h2>
      <button class="btn btn-primary" routerLink="/interlocuteur/tickets/create">
        <i class="bi bi-plus-circle me-2"></i>Nouveau ticket
      </button>
    </div>
    
    <div class="card">
      <div class="card-body">
        <div class="mb-3">
          <div class="row g-2">
            <div class="col-md-4">
              <select 
                class="form-select" 
                (change)="filterByStatus($event)"
              >
                <option value="">Tous les statuts</option>
                <option value="open">Ouvert</option>
                <option value="resolved">Résolu</option>
                <option value="closed">Clôturé</option>
              </select>
            </div>
            <div class="col-md-4">
              <select 
                class="form-select"
                (change)="filterByPriority($event)"
              >
                <option value="">Toutes les priorités</option>
                <option value="urgent">Urgent</option>
                <option value="important">Important</option>
                <option value="mineur">Mineur</option>
              </select>
            </div>
            <div class="col-md-4">
              <select 
                class="form-select"
                (change)="filterByCategory($event)"
              >
                <option value="">Toutes les catégories</option>
                <option value="Infrastructure informatique">Infrastructure informatique</option>
                <option value="Entretien des locaux">Entretien des locaux</option>
                <option value="Sécurité et sûreté">Sécurité et sûreté</option>
              </select>
            </div>
          </div>
        </div>
        
    
        
        <div *ngIf="!isLoading && tickets.length === 0" class="text-center py-5">
          <p class="text-muted">Aucun ticket trouvé</p>
          <button class="btn btn-outline-primary mt-2" routerLink="/interlocuteur/tickets/create">
            Créer un ticket
          </button>
        </div>
        
        <div *ngIf="!isLoading && tickets.length > 0">
          <div class="ticket-list">
            <div *ngFor="let ticket of tickets" class="ticket-item p-3 mb-3 rounded shadow-sm status-{{ ticket.status }} priority-{{ ticket.priority }}">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h5 class="mb-1">
                    <a [routerLink]="['/interlocuteur/tickets', ticket._id]" class="text-decoration-none">
                      {{ ticket.title }}
                    </a>
                  </h5>
                  <div class="d-flex gap-2 mb-2">
                    <app-ticket-status-badge [status]="ticket.status"></app-ticket-status-badge>
                    <app-ticket-priority-badge [priority]="ticket.priority"></app-ticket-priority-badge>
                    <span class="badge bg-secondary">{{ ticket.category }}</span>
                  </div>
                  <p class="text-muted mb-1">
                    <small>
                      Créé le {{ ticket.createdAt | date:'dd/MM/yyyy à HH:mm' }}
                    </small>
                  </p>
                </div>
                <div class="d-flex gap-2">
                  <button 
                    *ngIf="ticket.status === 'resolved'" 
                    class="btn btn-sm btn-outline-success"
                    (click)="closeTicket(ticket._id)"
                  >
                    Clôturer
                  </button>
                  <button 
                    *ngIf="ticket.status === 'open'" 
                    class="btn btn-sm btn-outline-primary"
                    [routerLink]="['/interlocuteur/tickets/edit', ticket._id]"
                  >
                    Modifier
                  </button>
                  <button 
                    type="button"
                    class="btn btn-sm btn-outline-primary"
                    [routerLink]="['/interlocuteur/tickets', ticket._id]"
                  >
                    Détails
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  isLoading = false;
  statusFilter = '';
  priorityFilter = '';
  categoryFilter = '';

  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.isLoading = true;
    
    const userId = this.authService.getUserId();
    if (!userId) {
      this.toastr.error('Session utilisateur invalide');
      this.isLoading = false;
      return;
    }
    
    const filters = {
      createdBy: userId
    };
    
    this.ticketService.getTickets(filters).subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        console.log('Tickets:', tickets);
        this.filteredTickets = [...tickets];
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error('Erreur lors du chargement des tickets');
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.tickets = this.filteredTickets.filter(ticket => {
      let matchesStatus = true;
      let matchesPriority = true;
      let matchesCategory = true;
      
      if (this.statusFilter) {
        matchesStatus = ticket.status === this.statusFilter;
      }
      
      if (this.priorityFilter) {
        matchesPriority = ticket.priority === this.priorityFilter;
      }
      
      if (this.categoryFilter) {
        matchesCategory = ticket.category === this.categoryFilter;
      }
      
      return matchesStatus && matchesPriority && matchesCategory;
    });
  }

  filterByStatus(event: Event): void {
    this.statusFilter = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  filterByPriority(event: Event): void {
    this.priorityFilter = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  filterByCategory(event: Event): void {
    this.categoryFilter = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  closeTicket(ticketId: string): void {
    this.isLoading = true;
    
    this.ticketService.closeStatus(ticketId, 'closed').subscribe({
      next: () => {
        this.toastr.success('Ticket clôturé avec succès');
        this.loadTickets();
      },
      error: (error) => {
        this.toastr.error('Erreur lors de la clôture du ticket');
        this.isLoading = false;
      }
    });
  }
}