import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TicketService } from '../../../core/services/ticket.service';
import { UserService } from '../../../core/services/user.service';
import { CategoryStat, PriorityStat, TicketStats } from '../../../core/models/ticket.model';
import { ToastrService } from 'ngx-toastr';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoadingSpinnerComponent,
    NgChartsModule
  ],
  template: `
    <div class="row">
      <div class="col-12">
        <h2 class="mb-4">Tableau de bord</h2>
        
        <div *ngIf="isLoading" class="text-center py-5">
          <app-loading-spinner></app-loading-spinner>
          <p>Spinner is active</p> <!-- Log visuel -->
        </div>
        
        <div *ngIf="!isLoading">
          <!-- Stats Overview -->
          <div class="row mb-4">
            <div class="col-md-3">
              <div class="dashboard-stat-card bg-white">
                <h5 class="text-muted mb-2">Total des tickets</h5>
                <h2 class="mb-0">{{ stats?.totalTickets || 0 }}</h2>
              </div>
            </div>
            <div class="col-md-3">
              <div class="dashboard-stat-card bg-white">
                <h5 class="text-muted mb-2">Tickets ouverts</h5>
                <h2 class="mb-0 text-danger">{{ stats?.openTickets || 0 }}</h2>
              </div>
            </div>
            <div class="col-md-3">
              <div class="dashboard-stat-card bg-white">
                <h5 class="text-muted mb-2">Tickets résolus</h5>
                <h2 class="mb-0 text-success">{{ stats?.resolvedTickets || 0 }}</h2>
              </div>
            </div>
            <div class="col-md-3">
              <div class="dashboard-stat-card bg-white">
                <h5 class="text-muted mb-2">Tickets fermés</h5>
                <h2 class="mb-0 text-success">{{ stats?.closedTickets || 0 }}</h2>
              </div>
            </div>
          </div>
          
          <!-- Charts -->
          <div class="row mb-4">
            <div class="col-md-6">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Tickets par catégorie</h5>
                  <div *ngIf="stats?.ticketsByCategory?.length === 0" class="text-center py-4">
                    <p class="text-muted">Aucune donnée disponible</p>
                  </div>
                  <div *ngIf="stats?.ticketsByCategory?.length !== 0" class="chart-container" style="height: 300px;">
                    <canvas baseChart
                      [datasets]="[{data: getCategoryData(), label: 'Tickets'}]"
                      [labels]="getCategoryLabels()"
                      [options]="{responsive: true}"
                      [legend]="true"
                      type="doughnut">
                    </canvas>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-md-6">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Tickets par priorité</h5>
                  <div *ngIf="stats?.ticketsByPriority?.length === 0" class="text-center py-4">
                    <p class="text-muted">Aucune donnée disponible</p>
                  </div>
                  <div *ngIf="stats?.ticketsByPriority?.length !== 0" class="chart-container" style="height: 300px;">
                    <canvas baseChart
                      [datasets]="[{data: getPriorityData(), label: 'Tickets'}]"
                      [labels]="getPriorityLabels()"
                      [options]="{responsive: true}"
                      [legend]="true"
                      type="doughnut">
                    </canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Top Agents -->
          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Top agents</h5>
                  
                  <div *ngIf="stats?.topAgents?.length === 0" class="text-center py-4">
                    <p class="text-muted">Aucune donnée disponible</p>
                  </div>
                  
                  <div *ngIf="stats?.topAgents?.length !== 0" class="table-responsive">
                    <table class="table table-hover">
                      <thead>
                        <tr>
                          <th>Agent</th>
                          <th>Spécialisation</th>
                          <th>Tickets résolus</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let agent of stats?.topAgents">
                          <td>{{ agent.agent.name }}</td>
                          <td>{{ agent.agent.specialization }}</td>
                          <td>{{ agent.resolvedCount }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
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
export class DashboardComponent implements OnInit {
  stats: TicketStats | null = null;
  isLoading = false;

  constructor(
    private ticketService: TicketService,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadStats();
    console.log('Dashboard component initialized');
  }

  loadStats(): void {
    this.isLoading = true;
    console.log('Spinner activated: isLoading =', this.isLoading);
    setTimeout(() => {
      this.ticketService.getTicketStats().subscribe({
        next: (response: { categoryStats: CategoryStat[]; priorityStats: PriorityStat[]; stats: any[]; topAgent: any }) => {
          // Mapper les données de la réponse
          this.stats = {
            totalTickets: response.stats[0]?.total || 0,
            openTickets: response.stats[0]?.open || 0,
            resolvedTickets: response.stats[0]?.resolved || 0,
            closedTickets: response.stats[0]?.closed || 0,
            resolutionRate: response.stats[0]?.resolutionRate || 0,
            ticketsByCategory: response.categoryStats.map((item: CategoryStat) => ({
              category: item._id,
              count: item.count
            })),
            ticketsByPriority: response.priorityStats.map((item: PriorityStat) => ({
              priority: item._id,
              count: item.count
            })),
            topAgents: response.topAgent || []
          };
          console.log('Stats loaded:', this.stats);
          this.toastr.success('Statistiques chargées avec succès');
          this.isLoading = false;
        },
        error: (error) => {
          this.toastr.error('Error loading stats:', error);
          this.isLoading = false;
          console.log('Spinner deactivated: isLoading =', this.isLoading);
        }
      });
    }, 4000); // Simulate a 4-second delay
  }
  
  getCategoryLabels(): string[] {
    return this.stats?.ticketsByCategory?.map(item => item.category) || [];
  }
  getCategoryData(): number[] {
    return this.stats?.ticketsByCategory?.map(item => item.count) || [];
  }
  getPriorityLabels(): string[] { 
    return this.stats?.ticketsByPriority?.map(item => item.priority) || [];
  }
  getPriorityData(): number[] {
    return this.stats?.ticketsByPriority?.map(item => item.count) || [];
  }
}