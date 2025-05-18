import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    
  ],
  template: `
    <div class="container">
      <div class="auth-container">
        <div class="card shadow">
          <div class="card-body p-4">
            <h2 class="text-center mb-4">Connexion</h2>
            
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  formControlName="email"
                  class="form-control"
                  [ngClass]="{'is-invalid': submitted && f['email'].errors}"
                />
                <div *ngIf="submitted && f['email'].errors" class="invalid-feedback">
                  <div *ngIf="f['email'].errors['required']">Email est requis</div>
                  <div *ngIf="f['email'].errors['email']">Format d'email invalide</div>
                </div>
              </div>
              
              <div class="mb-4">
                <label for="password" class="form-label">Mot de passe</label>
                <input
                  type="password"
                  id="password"
                  formControlName="password"
                  class="form-control"
                  [ngClass]="{'is-invalid': submitted && f['password'].errors}"
                />
                <div *ngIf="submitted && f['password'].errors" class="invalid-feedback">
                  <div *ngIf="f['password'].errors['required']">Mot de passe est requis</div>
                </div>
              </div>
              
             
              <button 
                type="submit" 
                class="btn btn-primary w-100 mb-3"
                [disabled]="isLoading"
              >
                Se connecter
              </button>
              
              <div class="text-center">
                <p class="mb-0">Pas encore de compte ? <a routerLink="/register">S'inscrire</a></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  isLoading = false;
  returnUrl: string = '/';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
          this.authService.redirectBasedOnRole();
    }
  } 

  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    
    this.authService.login(this.loginForm.value)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.toastr.success('Connexion réussie');
          this.authService.redirectBasedOnRole();
        },
        error: (error) => {
          this.isLoading = false;
          this.toastr.error(error.message || 'Échec de la connexion');
        }
      });
  }
}