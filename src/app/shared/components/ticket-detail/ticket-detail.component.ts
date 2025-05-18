import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from '../../../core/services/ticket.service';
import { Ticket } from '../../../core/models/ticket.model';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { TicketPriorityBadgeComponent } from '../ticket-priority-badge/ticket-priority-badge.component';
import { TicketStatusBadgeComponent } from '../ticket-status-badge/ticket-status-badge.component';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [
    CommonModule,
    TicketPriorityBadgeComponent,
    TicketStatusBadgeComponent
  ],
  template: `
    <div class="card ticket-detail-card mx-auto mt-4" style="max-width: 1200px;" *ngIf="ticket; else loadingOrError">
    <div class="card-body">
      <div class="d-flex align-items-center justify-content-between mb-3 flex-nowrap">
        <h2 class="mb-0 flex-grow-1">{{ ticket.title }}</h2>
        <button class="btn btn-secondary ms-3 flex-shrink-0" (click)="goBack()">
          <i class="bi bi-arrow-left"></i> Retour
        </button>
      </div>
      <div class="d-flex gap-2 align-items-center mb-3 flex-wrap">
        <app-ticket-status-badge [status]="ticket.status"></app-ticket-status-badge>
        <app-ticket-priority-badge [priority]="ticket.priority"></app-ticket-priority-badge>
        <span class="badge bg-secondary">{{ ticket.category }}</span>
      </div>
      <p class="mb-3">{{ ticket.description }}</p>
      <div class="mb-2 text-muted">
        <small>
          Créé le {{ ticket.createdAt | date:'dd/MM/yyyy à HH:mm' }}
        </small>
      </div>
      <div *ngIf="ticket.image" class="mb-4 text-center">
        <img [src]="imageUrl + ticket.image" alt="Pièce jointe" class="ticket-image shadow-sm">
      </div>
    </div>
  </div>
  <ng-template #loadingOrError>
    <div class="text-center py-5">
      <div *ngIf="isLoading" class="loading-spinner mx-auto mb-3"></div>
      <p *ngIf="isLoading">Chargement...</p>
      <p *ngIf="error" class="text-danger">{{ error }}</p>
    </div>
  </ng-template>
  `,
  styles: [`
    .ticket-detail-card {
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.07);
      background: #fff;
    }
    .ticket-image {
      max-width: 100%;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.08);
    }
    h2 {
      color: var(--primary-color);
      font-weight: 600;
    }
    .badge.bg-secondary {
      font-size: 0.85rem;
      padding: 0.4em 0.7em;
    }
    .loading-spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border-left-color: var(--primary-color);
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg);}
      100% { transform: rotate(360deg);}
    }
  `]
})
export class TicketDetailComponent implements OnInit {
  ticket: Ticket | null = null;
  imageUrl = environment.imageUrl;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.ticketService.getTicketById(id).subscribe({
        next: (ticket) => {
          this.ticket = ticket;
          this.isLoading = false;
        },
        error: () => {
          this.error = "Ticket introuvable ou erreur serveur.";
          this.isLoading = false;
        }
      });
    } else {
      this.error = "Identifiant de ticket manquant.";
      this.isLoading = false;
    }
  }

  goBack() {
    window.history.back();
  }
}