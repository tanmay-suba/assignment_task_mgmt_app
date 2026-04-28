import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TaskItem, TaskPriority, TaskStatus } from '../../../core/models/task.model';

export interface TaskFormData {
  task?: TaskItem;
}

export interface TaskFormValue {
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date | null;
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent {
  readonly priorities: TaskPriority[] = ['Low', 'Medium', 'High'];
  readonly statuses: TaskStatus[] = ['Todo', 'InProgress', 'Done'];

  form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(200)] }),
    description: new FormControl<string | null>(''),
    status: new FormControl<TaskStatus>('Todo', { nonNullable: true }),
    priority: new FormControl<TaskPriority>('Medium', { nonNullable: true }),
    dueDate: new FormControl<Date | null>(null)
  });

  constructor(
    private readonly dialogRef: MatDialogRef<TaskFormComponent, TaskFormValue>,
    @Inject(MAT_DIALOG_DATA) public data: TaskFormData
  ) {
    if (data.task) {
      this.form.patchValue({
        title: data.task.title,
        description: data.task.description ?? '',
        status: data.task.status,
        priority: data.task.priority,
        dueDate: data.task.dueDate ? new Date(data.task.dueDate) : null
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close({
      title: this.form.value.title ?? '',
      description: this.form.value.description ?? '',
      status: this.form.value.status ?? 'Todo',
      priority: this.form.value.priority ?? 'Medium',
      dueDate: this.form.value.dueDate ?? null
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
