import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/api/tasks';
  private tasks: Task[] = [];

  constructor(private http: HttpClient) {
    this.loadTasks();
  }

  private loadTasks(): void {
    this.http.get<Task[]>(this.apiUrl).subscribe(
      tasks => this.tasks = tasks
    );
  }

  getTasks(): Task[] {
    return this.tasks;
  }

  addTask(title: string, description: string): void {
    const task = {
      title,
      description,
      disabled: false
    };

    this.http.post<Task>(this.apiUrl, task).subscribe(
      newTask => {
        this.tasks.push({...newTask, selected: false});
      }
    );
  }

  updateTask(task: Task): void {
    this.http.put<Task>(`${this.apiUrl}/${task.id}`, task).subscribe(
      updatedTask => {
        const index = this.tasks.findIndex(t => t.id === updatedTask.id);
        if (index > -1) {
          this.tasks[index] = {...updatedTask, selected: false};
        }
      }
    );
  }

  deleteTask(task: Task): void {
    this.http.delete(`${this.apiUrl}/${task.id}`).subscribe(
      () => {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index > -1) {
          this.tasks.splice(index, 1);
        }
      }
    );
  }

  toggleTask(task: Task): void {
    this.http.patch<Task>(`${this.apiUrl}/${task.id}/toggle`, {}).subscribe(
      updatedTask => {
        const index = this.tasks.findIndex(t => t.id === updatedTask.id);
        if (index > -1) {
          this.tasks[index] = {...updatedTask, selected: false};
        }
      }
    );
  }

  bulkDisable(): number {
    const selectedTasks = this.tasks.filter(task => task.selected);
    const selectedIds = selectedTasks.map(task => task.id);
    
    if (selectedIds.length > 0) {
      this.http.patch(`${this.apiUrl}/bulk-disable`, selectedIds).subscribe(
        () => {
          selectedTasks.forEach(task => {
            task.disabled = true;
            task.selected = false;
          });
        }
      );
    }
    return selectedIds.length;
  }

  bulkDelete(): number {
    const selectedIds = this.tasks.filter(task => task.selected).map(task => task.id);
    
    if (selectedIds.length > 0) {
      this.http.delete(`${this.apiUrl}/bulk`, { body: selectedIds }).subscribe(
        () => {
          this.tasks = this.tasks.filter(task => !task.selected);
        }
      );
    }
    return selectedIds.length;
  }

  getSelectedCount(): number {
    return this.tasks.filter(task => task.selected).length;
  }

  hasSelectedTasks(): boolean {
    return this.tasks.some(task => task.selected);
  }
}