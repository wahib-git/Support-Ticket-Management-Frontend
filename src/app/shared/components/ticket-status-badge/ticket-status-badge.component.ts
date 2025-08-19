import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ticket-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="status-badge {{ status }}" [ngClass]="customClass">
      {{ getStatusLabel() }}
    </span>
  `,
  styles: []
})
export class TicketStatusBadgeComponent {
  @Input() status: 'open' | 'resolved' | 'closed' = 'open';
  @Input() customClass: string = '';

  getStatusLabel(): string {
    switch(this.status) {
      case 'open': return 'Ouvert';
      case 'resolved': return 'Résolu';
      case 'closed': return 'Clôturé';
      default: return 'Inconnu';
    }
  }
}