import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../interfaces/task.interface';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bulk-actions" *ngIf="hasSelectedTasks()">
      <button 
        (click)="onBulkAction()"
        class="btn btn-warning"
      >
        Actions sur {{ getSelectedCount() }} tâche(s)
      </button>
    </div>

    <div class="task-list">
      <h2>Liste des Tâches</h2>
      <div 
        *ngFor="let task of tasks" 
        class="task-item"
        [class.disabled]="task.disabled"
      >
        <div class="task-header">
          <input 
            type="checkbox" 
            [(ngModel)]="task.selected"
            class="task-checkbox"
          >
          <h3>{{task.title}}</h3>
        </div>
        <p>{{task.description}}</p>
        <div class="task-actions">
          <button 
            (click)="onEdit(task)"
            class="btn btn-info"
          >
            Modifier
          </button>
          <button 
            (click)="onToggle(task)" 
            class="btn"
            [class.btn-primary]="task.disabled"
            [class.btn-danger]="!task.disabled"
          >
            {{task.disabled ? 'Activer' : 'Désactiver'}}
          </button>
          <button 
            (click)="onDelete(task)" 
            class="btn btn-danger"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  `
})
export class TaskListComponent {
  constructor(private taskService: TaskService) {}

  get tasks(): Task[] {
    return this.taskService.getTasks();
  }

  hasSelectedTasks(): boolean {
    return this.taskService.hasSelectedTasks();
  }

  getSelectedCount(): number {
    return this.taskService.getSelectedCount();
  }

  onEdit(task: Task): void {
    this.showModal('edit', task);
  }

  onToggle(task: Task): void {
    this.showModal('disable', task);
  }

  onDelete(task: Task): void {
    this.showModal('delete', task);
  }

  onBulkAction(): void {
    this.showModal('bulk', null);
  }

  private showModal(type: 'disable' | 'delete' | 'edit' | 'bulk', task: Task | null): void {
    // Émet un événement pour afficher le modal
  }
}