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

import { User } from './user.model';