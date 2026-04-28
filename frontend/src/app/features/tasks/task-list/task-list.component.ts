import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TaskItem } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
  @Input() tasks: TaskItem[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;

  @Output() toggleComplete = new EventEmitter<{ task: TaskItem; isComplete: boolean }>();
  @Output() edit = new EventEmitter<TaskItem>();
  @Output() delete = new EventEmitter<TaskItem>();
  @Output() inlineSave = new EventEmitter<{ task: TaskItem; title: string }>();
  @Output() create = new EventEmitter<void>();

  editingId = signal<string | null>(null);
  draftTitle = signal('');

  startInlineEdit(task: TaskItem): void {
    this.editingId.set(task.id);
    this.draftTitle.set(task.title);
  }

  saveInlineEdit(task: TaskItem): void {
    const title = this.draftTitle().trim();
    this.editingId.set(null);
    this.inlineSave.emit({ task, title });
  }

  cancelInlineEdit(): void {
    this.editingId.set(null);
  }

  isOverdue(task: TaskItem): boolean {
    if (!task.dueDate || task.status === 'Done') {
      return false;
    }

    return new Date(task.dueDate) < new Date();
  }
}
