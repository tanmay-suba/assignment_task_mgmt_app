import { CommonModule } from '@angular/common';
import { Component, DestroyRef, ElementRef, EventEmitter, Output, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { debounceTime } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TaskPriority, TaskQuery, TaskStatus } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatChipsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule
  ],
  templateUrl: './task-filter.component.html',
  styleUrl: './task-filter.component.scss'
})
export class TaskFilterComponent {
  private readonly destroyRef = inject(DestroyRef);

  @Output() filtersChange = new EventEmitter<TaskQuery>();
  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  readonly statuses: TaskStatus[] = ['Todo', 'InProgress', 'Done'];
  readonly priorities: TaskPriority[] = ['Low', 'Medium', 'High'];
  readonly sortOptions = [
    { value: 'updatedAt', label: 'Recently updated' },
    { value: 'createdAt', label: 'Newest first' },
    { value: 'dueDate', label: 'Due date' },
    { value: 'priority', label: 'Priority' }
  ];

  form = new FormGroup({
    search: new FormControl(''),
    status: new FormControl<TaskStatus | null>(null),
    priority: new FormControl<TaskPriority | null>(null),
    sort: new FormControl('updatedAt'),
    dueBefore: new FormControl<Date | null>(null)
  });

  constructor() {
    this.form.valueChanges
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.filtersChange.emit({
          search: value.search?.trim() || null,
          status: value.status ?? null,
          priority: value.priority ?? null,
          sort: value.sort ?? null,
          dueBefore: value.dueBefore ? value.dueBefore.toISOString() : null
        });
      });
  }

  clearFilters(): void {
    this.form.reset({
      search: '',
      status: null,
      priority: null,
      sort: 'updatedAt',
      dueBefore: null
    });
  }

  focusSearch(): void {
    this.searchInput?.nativeElement.focus();
  }
}
