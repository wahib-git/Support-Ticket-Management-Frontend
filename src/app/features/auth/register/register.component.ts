import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
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
            <h2 class="text-center mb-4">Inscription</h2>
            
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label for="name" class="form-label">Nom complet</label>
                <input
                  type="text"
                  id="name"
                  formControlName="name"
                  class="form-control"
                  [ngClass]="{'is-invalid': submitted && f['name'].errors}"
                />
                <div *ngIf="submitted && f['name'].errors" class="invalid-feedback">
                  <div *ngIf="f['name'].errors['required']">Nom est requis</div>
                </div>
              </div>
              
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
              
              <div class="mb-3">
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
                  <div *ngIf="f['password'].errors['minlength']">Mot de passe doit avoir au moins 5 caractères</div>
                </div>
              </div>
              
              <div class="mb-3">
                <label for="role" class="form-label">Rôle</label>
                <select
                  id="role"
                  formControlName="role"
                  class="form-select"
                  [ngClass]="{'is-invalid': submitted && f['role'].errors}"
                  (change)="onRoleChange()"
                >
                  <option value="">Sélectionner un rôle</option>
                  <option value="interlocuteur">Interlocuteur</option>
                  <option value="agent">Agent de support</option>
                </select>
                <div *ngIf="submitted && f['role'].errors" class="invalid-feedback">
                  <div *ngIf="f['role'].errors['required']">Rôle est requis</div>
                </div>
              </div>
              
              <div class="mb-4" *ngIf="isAgentRole()">
                <label for="specialization" class="form-label">Spécialisation</label>
                <select
                  id="specialization"
                  formControlName="specialization"
                  class="form-select"
                  [ngClass]="{'is-invalid': submitted && f['specialization'].errors}"
                >
                  <option value="">Sélectionner une spécialisation</option>
                  <option value="Infrastructure informatique">Infrastructure informatique</option>
                  <option value="Entretien des locaux">Entretien des locaux</option>
                  <option value="Sécurité et sûreté">Sécurité et sûreté</option>
                </select>
                <div *ngIf="submitted && f['specialization'].errors" class="invalid-feedback">
                  <div *ngIf="f['specialization'].errors['required']">Spécialisation est requise</div>
                </div>
              </div>
              
              <div class="mb-4" *ngIf="isInterlocuteurRole()">
                <label for="userProfile" class="form-label">Profile</label>
                <select
                  id="userProfile"
                  formControlName="userProfile"
                  class="form-select"
                  [ngClass]="{'is-invalid': submitted && f['userProfile'].errors}"
                >
                  <option value="">Sélectionner un profile </option>
                  <option value="enseignant">Enseignant</option>
                  <option value="etudient">Etudient</option>
                  <option value="personnel">Personnel</option>
                </select>
                <div *ngIf="submitted && f['userProfile'].errors" class="invalid-feedback">
                  <div *ngIf="f['userProfile'].errors['required']">Profile est requise</div>
                </div>
              </div>
              
              <button 
                type="submit" 
                class="btn btn-primary w-100 mb-3"
                [disabled]="isLoading"
              >
                S'inscrire
              </button>
              
              <div class="text-center">
                <p class="mb-0">Déjà inscrit ? <a routerLink="/login">Se connecter</a></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    document.body.classList.add('auth-bg');
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      role: ['', Validators.required],
      specialization: [''],
      userProfile: ['']
    });
    
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
        this.authService.redirectBasedOnRole();
    }
  }

  get f() { return this.registerForm.controls; }
  
  isAgentRole(): boolean {
    return this.registerForm.get('role')?.value === 'agent';
  }
  isInterlocuteurRole(): boolean {
    return this.registerForm.get('role')?.value === 'interlocuteur';
  }
  
  onRoleChange(): void {
    const specializationControl = this.registerForm.get('specialization');
    if (this.isAgentRole()) {
      specializationControl?.setValidators(Validators.required);
    } else {
      specializationControl?.clearValidators();
      specializationControl?.setValue('');
    }
    specializationControl?.updateValueAndValidity();

    const profileControl = this.registerForm.get('userProfile');
    if (this.isInterlocuteurRole()) {
      profileControl?.setValidators(Validators.required);
    }
    else {
      profileControl?.clearValidators();
      profileControl?.setValue('');
    }
    profileControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    
    // Remove specialization if not an agent and remove profile if not an interlocuteur
    const registerData = {...this.registerForm.value};
    if (registerData.role !== 'agent') {
      delete registerData.specialization;
    }
    if (registerData.role !== 'interlocuteur') {
      delete registerData.userProfile;
    }
    // Call the register method from AuthService
    this.authService.register(registerData)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.toastr.success('Inscription réussie');
          this.authService.redirectBasedOnRole();
        },
        error: (error) => {
          this.isLoading = false;
          this.toastr.error(error.message || 'Échec de l\'inscription');
        }
      });
  }
  ngOnDestroy(): void {
    document.body.classList.remove('auth-bg');
  }
}