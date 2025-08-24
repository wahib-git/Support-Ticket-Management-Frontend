import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TicketService } from '../../../core/services/ticket.service';
import { UserService } from '../../../core/services/user.service';
import { TicketStats, ApiStatsResponse } from '../../../core/models/ticket.model';
import { ToastrService } from 'ngx-toastr';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NgChartsModule],
  template: `
    <div class="row">
      <div class="col-12">
        <h2 class="mb-4">Tableau de bord</h2>

        <div *ngIf="!isLoading">
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
                <h2 class="mb-0 text-success">
                  {{ stats?.resolvedTickets || 0 }}
                </h2>
              </div>
            </div>
            <div class="col-md-3">
              <div class="dashboard-stat-card bg-white">
                <h5 class="text-muted mb-2">Tickets fermés</h5>
                <h2 class="mb-0 text-success">
                  {{ stats?.closedTickets || 0 }}
                </h2>
              </div>
            </div>
          </div>

          <div class="row mb-4">
            <div class="col-md-6">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Tickets par catégorie</h5>
                  <div
                    *ngIf="stats?.ticketsByCategory?.length === 0"
                    class="text-center py-4"
                  >
                    <p class="text-muted">Aucune donnée disponible</p>
                  </div>
                  <div
                    *ngIf="stats?.ticketsByCategory?.length !== 0"
                    class="chart-container"
                    style="height: 300px;"
                  >
                    <canvas
                      baseChart
                      [datasets]="[{ data: categoryData, label: 'Tickets' }]"
                      [labels]="categoryLabels"
                      [options]="{ responsive: true }"
                      [legend]="true"
                      type="doughnut"
                    >
                    </canvas>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Tickets par priorité</h5>
                  <div
                    *ngIf="stats?.ticketsByPriority?.length === 0"
                    class="text-center py-4"
                  >
                    <p class="text-muted">Aucune donnée disponible</p>
                  </div>
                  <div
                    *ngIf="stats?.ticketsByPriority?.length !== 0"
                    class="chart-container"
                    style="height: 300px;"
                  >
                    <canvas
                      baseChart
                      [datasets]="[{ data: priorityData, label: 'Tickets' }]"
                      [labels]="priorityLabels"
                      [options]="{ responsive: true }"
                      [legend]="true"
                      type="doughnut"
                    >
                    </canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Top agents</h5>

                  <div
                    *ngIf="stats?.topAgents?.length === 0"
                    class="text-center py-4"
                  >
                    <p class="text-muted">Aucune donnée disponible</p>
                  </div>

                  <div
                    *ngIf="stats?.topAgents?.length !== 0"
                    class="table-responsive"
                  >
                    <table class="table table-hover">
                      <thead>
                        <tr>
                          <th>Agent</th>
                          <th>Spécialisation</th>
                          <th>Tickets assignés</th>
                          <th>Tickets résolus</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let agent of stats?.topAgents">
                          <td>{{ agent.name }}</td>
                          <td>{{ agent.specialization }}</td>
                          <td>{{ agent.assignedCount }}</td>
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
  styles: [],
})
export class DashboardComponent implements OnInit {
  stats: TicketStats | null = null;
  isLoading = false;
  categoryLabels: string[] = [];
  categoryData: number[] = [];
  priorityLabels: string[] = [];
  priorityData: number[] = [];

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
    console.log('Dashboard loadStats called');
    this.isLoading = true;
    this.ticketService.getTicketStats().subscribe({
      next: (response: ApiStatsResponse) => {
        // Map the API response to the `TicketStats` interface
        this.stats = {
          totalTickets: response.stats[0]?.total || 0,
          openTickets: response.stats[0]?.open || 0,
          resolvedTickets: response.stats[0]?.resolved || 0,
          closedTickets: response.stats[0]?.closed || 0,
          resolutionRate: response.stats[0]?.resolutionRate || 0,
          ticketsByCategory: response.categoryStats.map(item => ({
            category: item._id,
            count: item.count,
          })),
          ticketsByPriority: response.priorityStats.map(item => ({
            priority: item._id,
            count: item.count,
          })),
          topAgents: response.agentsStats.sort(
            (a, b) => b.resolvedCount - a.resolvedCount
          ),
        };

        console.log('Stats loaded:', this.stats);
        console.log('topAgents:', this.stats.topAgents);

        this.toastr.success('Statistiques chargées avec succès');
        
        // Populate chart data
        this.categoryLabels = this.stats.ticketsByCategory.map(
          (item) => item.category
        );
        this.categoryData = this.stats.ticketsByCategory.map(
          (item) => item.count
        );
        this.priorityLabels = this.stats.ticketsByPriority.map(
          (item) => item.priority
        );
        this.priorityData = this.stats.ticketsByPriority.map(
          (item) => item.count
        );
        
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error('Error loading stats:', error);
        this.isLoading = false;
      },
    });
  }
}