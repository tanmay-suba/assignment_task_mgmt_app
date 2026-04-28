export type TaskStatus = 'Todo' | 'InProgress' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface TaskItem {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
}

export interface TaskQuery {
  status?: TaskStatus | null;
  priority?: TaskPriority | null;
  search?: string | null;
  dueBefore?: string | null;
  sort?: string | null;
  page?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
}
