import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Ticket, TicketFilters, ApiStatsResponse } from '../models/ticket.model';


@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = `${environment.apiUrl}/tickets`;
  private ticketsSubject = new BehaviorSubject<Ticket[]>([]);
  public tickets$ = this.ticketsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Get all tickets or filtered by user role
  getTickets(filters?: TicketFilters): Observable<Ticket[]> {
    let params = new HttpParams();
    console.log('Filters:', filters);
    console.log('params:', params);
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof TicketFilters]) {
          params = params.append(key, filters[key as keyof TicketFilters] as string);
        }
      });
    }

    return this.http.get<Ticket[]>(`${environment.apiUrl}/tickets/mytickets`, { params })
      .pipe(
        tap(tickets => this.ticketsSubject.next(tickets))
      );
  }

  // Get a single ticket by ID
  getTicketById(id: string): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`);
  }

  // Create a new ticket
  createTicket(ticketData: FormData): Observable<Ticket> {
    return this.http.post<Ticket>(this.apiUrl, ticketData)
      .pipe(
        tap(newTicket => {
          const currentTickets = this.ticketsSubject.value;
          this.ticketsSubject.next([...currentTickets, newTicket]);
        })
      );
  }

  // Update a ticket
  updateTicket(id: string, ticketData:FormData): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.apiUrl}/${id}`, ticketData)
      .pipe(
        tap(updatedTicket => {
          const currentTickets = this.ticketsSubject.value;
          const updatedTickets = currentTickets.map(ticket =>
            ticket._id === id ? updatedTicket : ticket
          );
          this.ticketsSubject.next(updatedTickets);
        })
      );
  }

  // Change ticket status
  changeStatus(ticketId: string, status: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${ticketId}/status`, { status });
  }

  // Change ticket status to "closed"
  closeStatus(ticketId: string, status: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${ticketId}/close`, { status });
  }

  // Get ticket statistics
  getTicketStats(): Observable<ApiStatsResponse> {
    return this.http.get<ApiStatsResponse>(`${environment.apiUrl}/admin/stats`);
  }
}