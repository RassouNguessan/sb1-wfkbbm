export interface Task {
  id: number;
  title: string;
  description: string;
  disabled: boolean;
  selected?: boolean;
}