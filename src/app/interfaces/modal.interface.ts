import { Task } from './task.interface';

export type ModalType = 'disable' | 'delete' | 'edit' | 'bulk';

export interface Modal {
  show: boolean;
  type: ModalType;
  task: Task | null;
}