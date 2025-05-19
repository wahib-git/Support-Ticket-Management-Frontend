import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TicketService } from '../../../core/services/ticket.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2>
            {{ isEditMode ? 'Modifier le ticket' : 'Créer un nouveau ticket' }}
          </h2>
          <button class="btn btn-outline-secondary" (click)="goBack()">
            <i class="bi bi-arrow-left me-2"></i>Retour
          </button>
        </div>

        <div class="card">
          <div class="card-body">
            <form [formGroup]="ticketForm" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label for="title" class="form-label">Titre</label>
                <input
                  type="text"
                  id="title"
                  formControlName="title"
                  class="form-control"
                  [ngClass]="{ 'is-invalid': submitted && f['title'].errors }"
                />
                <div
                  *ngIf="submitted && f['title'].errors"
                  class="invalid-feedback"
                >
                  <div *ngIf="f['title'].errors['required']">
                    Titre est requis
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea
                  id="description"
                  formControlName="description"
                  class="form-control"
                  rows="2"
                  [ngClass]="{
                    'is-invalid': submitted && f['description'].errors
                  }"
                ></textarea>
                <div
                  *ngIf="submitted && f['description'].errors"
                  class="invalid-feedback"
                >
                  <div *ngIf="f['description'].errors['required']">
                    Description est requise
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="category" class="form-label">Catégorie</label>
                  <select
                    id="category"
                    formControlName="category"
                    class="form-select"
                    [ngClass]="{
                      'is-invalid': submitted && f['category'].errors
                    }"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="Infrastructure informatique">
                      Infrastructure informatique
                    </option>
                    <option value="Entretien des locaux">
                      Entretien des locaux
                    </option>
                    <option value="Sécurité et sûreté">
                      Sécurité et sûreté
                    </option>
                  </select>
                  <div
                    *ngIf="submitted && f['category'].errors"
                    class="invalid-feedback"
                  >
                    <div *ngIf="f['category'].errors['required']">
                      Catégorie est requise
                    </div>
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label for="priority" class="form-label">Priorité</label>
                  <select
                    id="priority"
                    formControlName="priority"
                    class="form-select"
                    [ngClass]="{
                      'is-invalid': submitted && f['priority'].errors
                    }"
                  >
                    <option value="">Sélectionner une priorité</option>
                    <option value="urgent">Urgent</option>
                    <option value="important">Important</option>
                    <option value="mineur">Mineur</option>
                  </select>
                  <div
                    *ngIf="submitted && f['priority'].errors"
                    class="invalid-feedback"
                  >
                    <div *ngIf="f['priority'].errors['required']">
                      Priorité est requise
                    </div>
                  </div>
                </div>
              </div>

              <div class="mb-4">
                <label for="image" class="form-label"
                  >Image (optionnelle)</label
                >
                <input
                  type="file"
                  id="image"
                  class="form-control"
                  (change)="onFileChange($event)"
                  accept="image/*"
                />
                <small class="form-text text-muted">
                  Formats acceptés: JPG, PNG, GIF. Taille max: 5MB
                </small>

                <div *ngIf="ticketImage" class="mt-4">
                  <img
                    [src]="ticketImage"
                    alt="Aperçu de l'image"
                    class="img-thumbnail"
                    style="max-height: 500px"
                  />
                </div>
              </div>

              <div class="d-grid gap-2">
                <button
                  type="submit"
                  class="btn btn-primary"
                  [disabled]="isLoading"
                >
                  {{ isEditMode ? 'Mettre à jour' : 'Créer le ticket' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class TicketFormComponent implements OnInit {
  ticketForm!: FormGroup;
  submitted = false;
  isLoading = false;
  isEditMode = false;
  ticketId: string = '';
  imageFile: File | null = null;
  ticketImage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.ticketForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      priority: ['', Validators.required],
    });

    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.ticketId = params['id'];
        this.loadTicket(this.ticketId);
      }
    });
  }

  get f() {
    return this.ticketForm.controls;
  }

  loadTicket(id: string): void {
    this.isLoading = true;
    this.ticketService.getTicketById(id).subscribe({
      next: (ticket) => {
        this.ticketForm.patchValue({
          title: ticket.title,
          description: ticket.description,
          category: ticket.category,
          priority: ticket.priority,
        });

        if (ticket.image) {
          this.ticketImage = ticket.image.startsWith('http')
            ? ticket.image
            : environment.imageUrl + ticket.image;
        }

        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error('Erreur lors du chargement du ticket');
        this.isLoading = false;
      },
    });
  }

  onFileChange(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.imageFile = fileInput.files[0];

      // Preview image
      const reader = new FileReader();
      reader.onload = () => {
        this.ticketImage = reader.result as string;
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.ticketForm.invalid) {
      return;
    }

    this.isLoading = true;

    if (this.isEditMode) {
      const formData = new FormData();
      formData.append('title', this.ticketForm.value.title);
      formData.append('description', this.ticketForm.value.description);
      formData.append('category', this.ticketForm.value.category);
      formData.append('priority', this.ticketForm.value.priority);

      if (this.imageFile) {
        formData.append('image', this.imageFile);
      }

      this.ticketService.updateTicket(this.ticketId, formData).subscribe({
        next: () => {
          this.isLoading = false;
          this.toastr.success('Ticket mis à jour avec succès');
          this.router.navigate(['/interlocuteur/tickets']);
        },
        error: (error) => {
          this.isLoading = false;
          this.toastr.error(
            error.message || 'Erreur lors de la mise à jour du ticket'
          );
        },
      });
    } else {
      const formData = new FormData();
      formData.append('title', this.ticketForm.value.title);
      formData.append('description', this.ticketForm.value.description);
      formData.append('category', this.ticketForm.value.category);
      formData.append('priority', this.ticketForm.value.priority);

      if (this.imageFile) {
        formData.append('image', this.imageFile);
      }

      this.ticketService.createTicket(formData).subscribe({
        next: () => {
          this.isLoading = false;
          this.toastr.success('Ticket créé avec succès');
          this.router.navigate(['/interlocuteur/tickets']);
        },
        error: (error) => {
          this.isLoading = false;
          this.toastr.error(
            error.message || 'Erreur lors de la création du ticket'
          );
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/interlocuteur/tickets']);
  }
}
