import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { TaskFormComponent } from './app/components/task-form/task-form.component';
import { TaskListComponent } from './app/components/task-list/task-list.component';
import { ModalComponent } from './app/components/modal/modal.component';
import { Modal } from './app/interfaces/modal.interface';
import { Task } from './app/interfaces/task.interface';
import { appConfig } from './app/app.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TaskFormComponent, TaskListComponent, ModalComponent],
  template: `
    <div class="container">
      <h1>Gestionnaire de Tâches</h1>
      <app-task-form></app-task-form>
      <app-task-list
        (showModal)="openModal($event.type, $event.task)"
      ></app-task-list>
      <app-modal
        [show]="modal.show"
        [type]="modal.type"
        [task]="modal.task"
        (close)="closeModal()"
      ></app-modal>
    </div>
  `,
})
export class App {
  modal: Modal = {
    show: false,
    type: 'disable',
    task: null
  };

  openModal(type: Modal['type'], task: Task | null): void {
    this.modal = {
      show: true,
      type,
      task: task ? {...task} : null
    };
  }

  closeModal(): void {
    this.modal = {
      show: false,
      type: 'disable',
      task: null
    };
  }
}

bootstrapApplication(App, appConfig);