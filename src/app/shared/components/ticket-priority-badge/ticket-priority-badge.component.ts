import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ticket-priority-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge rounded-pill" [ngClass]="getPriorityClass()">
      {{ getPriorityLabel() }}
    </span>
  `,
  styles: [`
    .badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
    }
  `]
})
export class TicketPriorityBadgeComponent {
  @Input() priority: 'urgent' | 'important' | 'mineur' = 'mineur';

  getPriorityClass(): string {
    switch(this.priority) {
      case 'urgent': return 'bg-danger';
      case 'important': return 'bg-warning text-dark';
      case 'mineur': return 'bg-info text-dark';
      default: return 'bg-secondary';
    }
  }

  getPriorityLabel(): string {
    switch(this.priority) {
      case 'urgent': return 'Urgent';
      case 'important': return 'Important';
      case 'mineur': return 'Mineur';
      default: return 'Inconnu';
    }
  }
}