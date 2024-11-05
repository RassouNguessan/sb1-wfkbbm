import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal, ModalType } from '../../interfaces/modal.interface';
import { Task } from '../../interfaces/task.interface';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal" *ngIf="show">
      <div class="modal-content">
        <h2>
          {{ 
            type === 'edit' ? 'Modifier la tâche' :
            type === 'bulk' ? 'Actions groupées' :
            'Confirmation'
          }}
        </h2>

        <!-- Formulaire d'édition -->
        <div *ngIf="type === 'edit' && task">
          <div class="form-group">
            <label for="editTitle">Titre:</label>
            <input 
              type="text" 
              id="editTitle" 
              [(ngModel)]="task.title" 
              class="form-control"
              required
            >
          </div>
          <div class="form-group">
            <label for="editDescription">Description:</label>
            <textarea 
              id="editDescription" 
              [(ngModel)]="task.description" 
              class="form-control"
              rows="3"
            ></textarea>
          </div>
        </div>

        <!-- Confirmation de suppression/désactivation -->
        <div *ngIf="type === 'disable' || type === 'delete'">
          <p *ngIf="type === 'disable'">
            Voulez-vous {{ task?.disabled ? 'activer' : 'désactiver' }} la tâche "{{ task?.title }}" ?
          </p>
          <p *ngIf="type === 'delete'">
            Voulez-vous supprimer la tâche "{{ task?.title }}" ?
          </p>
          <p class="task-details">{{ task?.description }}</p>
        </div>

        <!-- Actions groupées -->
        <div *ngIf="type === 'bulk'">
          <p>Sélectionnez l'action à appliquer sur {{ selectedCount }} tâche(s) :</p>
          <div class="bulk-modal-actions">
            <button 
              (click)="onBulkDisable()"
              class="btn btn-warning"
            >
              Désactiver
            </button>
            <button 
              (click)="onBulkDelete()"
              class="btn btn-danger"
            >
              Supprimer
            </button>
          </div>
        </div>

        <div class="modal-buttons">
          <button 
            *ngIf="type !== 'bulk'"
            (click)="onConfirm()" 
            class="btn btn-primary"
          >
            {{ type === 'edit' ? 'Enregistrer' : 'Oui' }}
          </button>
          <button 
            (click)="onClose()" 
            class="btn btn-secondary"
          >
            {{ type === 'edit' ? 'Annuler' : 'Non' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class ModalComponent {
  @Input() show = false;
  @Input() type: ModalType = 'disable';
  @Input() task: Task | null = null;
  @Output() close = new EventEmitter<void>();

  constructor(private taskService: TaskService) {}

  get selectedCount(): number {
    return this.taskService.getSelectedCount();
  }

  onConfirm(): void {
    if (this.task) {
      switch (this.type) {
        case 'disable':
          this.taskService.toggleTask(this.task);
          alert(`La tâche "${this.task.title}" a été ${this.task.disabled ? 'désactivée' : 'activée'} avec succès !`);
          break;
        case 'delete':
          this.taskService.deleteTask(this.task);
          alert(`La tâche "${this.task.title}" a été supprimée avec succès !`);
          break;
        case 'edit':
          this.taskService.updateTask(this.task);
          alert(`La tâche "${this.task.title}" a été modifiée avec succès !`);
          break;
      }
    }
    this.onClose();
  }

  onBulkDisable(): void {
    const count = this.taskService.bulkDisable();
    alert(`${count} tâche(s) ont été désactivées avec succès !`);
    this.onClose();
  }

  onBulkDelete(): void {
    const count = this.taskService.bulkDelete();
    alert(`${count} tâche(s) ont été supprimées avec succès !`);
    this.onClose();
  }

  onClose(): void {
    this.close.emit();
  }
}