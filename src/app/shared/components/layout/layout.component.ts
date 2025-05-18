import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  template: `
    <div class="container-fluid p-0">
      <div class="row g-0">
        <div class="col-md-3 col-lg-2 d-none d-md-block">
          <app-sidebar [role]="role"></app-sidebar>
        </div>
        <div class="col-12 col-md-9 col-lg-10">
          <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom py-2 d-md-none">
            <div class="container-fluid">
              <a class="navbar-brand" href="#">Support Scolaire</a>
              <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebar">
                <span class="navbar-toggler-icon"></span>
              </button>
              
              <div class="offcanvas offcanvas-start" tabindex="-1" id="sidebar">
                <div class="offcanvas-header">
                  <h5 class="offcanvas-title">Menu</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">
                  <app-sidebar [role]="role"></app-sidebar>
                </div>
              </div>
            </div>
          </nav>
          
          <main class="page-container">
            <div class="container-fluid">
              <router-outlet></router-outlet> 
            </div>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LayoutComponent {
  @Input() role: string = '';
}