export interface Ticket {
  _id: string;
  title: string;
  description: string;
  category: 'Infrastructure informatique' | 'Entretien des locaux' | 'Sécurité et sûreté';
  priority: 'urgent' | 'important' | 'mineur';
  status: 'open'  | 'resolved' | 'closed';
  createdBy: string | User;
  assignedTo?: string | User;
  image?: string;
  createdAt: string;
  updatedAt: string;
}
export interface CategoryStat {
  _id: string; // Nom de la catégorie
  count: number; // Nombre de tickets
}
export interface PriorityStat {
  _id: string; // Nom de la priorité
  count: number; // Nombre de tickets
}
export interface TopAgent {
  name: string;
  specialization: string;
  resolvedCount: number;
  assignedCount: number;
}


export interface TicketStats {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  resolutionRate: number;
  ticketsByCategory: { category: string; count: number }[];
  ticketsByPriority: { priority: string; count: number }[];
  topAgents: TopAgent[];}

export interface TicketFilters {
  status?: 'open' | 'resolved' | 'closed';
  priority?: 'urgent' | 'important' | 'mineur';
  category?: 'Infrastructure informatique' | 'Entretien des locaux' | 'Sécurité et sûreté';
  assignedTo?: string; // User ID
  createdBy?: string; // User ID
  dateFrom?: string; // ISO date string
  dateTo?: string;   // ISO date string
} 
// Interface that matches the exact structure of your API response
export interface ApiStatsResponse {
  stats: {
    total: number;
    open: number;
    resolved: number;
    closed: number;
    resolutionRate: number;
  }[];
  categoryStats: { _id: string; count: number }[];
  priorityStats: { _id: string; count: number }[];
  agentsStats: {
    name: string;
    specialization: string;
    resolvedCount: number;
    assignedCount: number;
  }[];
}


import { User } from './user.model';