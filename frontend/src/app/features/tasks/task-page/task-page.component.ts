import { CommonModule } from '@angular/common';
import { Component, DestroyRef, HostListener, ViewChild, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TaskItem, TaskPriority, TaskQuery, TaskStatus } from '../../../core/models/task.model';
import { TaskService } from '../../../core/services/task.service';
import { ToastService } from '../../../core/services/toast.service';
import { TaskFilterComponent } from '../task-filter/task-filter.component';
import { TaskFormComponent, TaskFormValue } from '../task-form/task-form.component';
import { TaskListComponent } from '../task-list/task-list.component';

@Component({
  selector: 'app-task-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    TaskFilterComponent,
    TaskListComponent
  ],
  templateUrl: './task-page.component.html',
  styleUrl: './task-page.component.scss'
})
export class TaskPageComponent {
  private readonly taskService = inject(TaskService);
  private readonly dialog = inject(MatDialog);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild(TaskFilterComponent)
  private filterComponent?: TaskFilterComponent;

  tasks = signal<TaskItem[]>([]);
  total = signal(0);
  loading = signal(false);
  error = signal<string | null>(null);

  private query = signal<TaskQuery>({
    sort: 'updatedAt',
    page: 1,
    pageSize: 20
  });

  overdueCount = computed(() =>
    this.tasks().filter(task => this.isOverdue(task)).length
  );

  constructor() {
    this.loadTasks();
  }

  onFiltersChange(filters: TaskQuery): void {
    this.query.update(current => ({
      ...current,
      ...filters,
      page: 1
    }));
    this.loadTasks();
  }

  openCreate(): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '560px',
      data: {}
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result?: TaskFormValue) => {
        if (!result) {
          return;
        }

        this.taskService.createTask(this.buildCreatePayload(result))
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.toast.success('Task created.');
            this.loadTasks();
          });
      });
  }

  openEdit(task: TaskItem): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '560px',
      data: { task }
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result?: TaskFormValue) => {
        if (!result) {
          return;
        }

        this.taskService.updateTask(task.id, this.buildUpdatePayload(task, result))
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.toast.success('Task updated.');
            this.loadTasks();
          });
      });
  }

  onToggleComplete(event: { task: TaskItem; isComplete: boolean }): void {
    const previous = this.tasks();
    const updated = previous.map(task =>
      task.id === event.task.id
        ? ({
            ...task,
            status: event.isComplete ? 'Done' : 'Todo',
            completedAt: event.isComplete ? new Date().toISOString() : null
          } as TaskItem)
        : task
    );

    this.tasks.set(updated);

    this.taskService.toggleComplete(event.task.id, event.isComplete)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (task) => {
          this.tasks.set(this.tasks().map(item => item.id === task.id ? task : item));
        },
        error: () => {
          this.tasks.set(previous);
        }
      });
  }

  onInlineSave(event: { task: TaskItem; title: string }): void {
    if (!event.title.trim() || event.title.trim() === event.task.title) {
      return;
    }

    this.taskService.updateTask(event.task.id, this.buildUpdatePayload(event.task, { title: event.title }))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.toast.success('Title updated.');
        this.loadTasks();
      });
  }

  onDelete(task: TaskItem): void {
    const previous = this.tasks();
    this.tasks.set(previous.filter(item => item.id !== task.id));

    const snackRef = this.toast.undo('Task deleted.');

    snackRef.onAction()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.tasks.set(previous);
      });

    snackRef.afterDismissed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(info => {
        if (info.dismissedByAction) {
          return;
        }

        this.taskService.deleteTask(task.id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => this.loadTasks());
      });
  }

  loadTasks(): void {
    this.loading.set(true);
    this.error.set(null);

    this.taskService.getTasks(this.query())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.tasks.set(result.items);
          this.total.set(result.total);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.error.set('Unable to load tasks right now.');
        }
      });
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    const isTypingTarget = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA';

    if (isTypingTarget) {
      return;
    }

    if (event.key === 'n' || event.key === 'N') {
      event.preventDefault();
      this.openCreate();
    }

    if (event.key === '/') {
      event.preventDefault();
      this.filterComponent?.focusSearch();
    }
  }

  private buildCreatePayload(values: TaskFormValue): Partial<TaskItem> {
    return {
      title: values.title.trim(),
      description: values.description?.trim() ?? null,
      priority: values.priority,
      dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null
    };
  }

  private buildUpdatePayload(task: TaskItem, values: Partial<TaskFormValue>): Partial<TaskItem> {
    const status = values.status ?? task.status;
    const priority = values.priority ?? task.priority;
    const title = values.title ?? task.title;
    const description = values.description ?? task.description ?? '';
    const hasDueDate = Object.prototype.hasOwnProperty.call(values, 'dueDate');
    const dueDate = hasDueDate
      ? (values.dueDate ? new Date(values.dueDate).toISOString() : null)
      : task.dueDate ?? null;

    return {
      title: title.trim(),
      description: description.trim() || null,
      status: status as TaskStatus,
      priority: priority as TaskPriority,
      dueDate
    };
  }

  private isOverdue(task: TaskItem): boolean {
    if (!task.dueDate || task.status === 'Done') {
      return false;
    }

    return new Date(task.dueDate) < new Date();
  }
}
