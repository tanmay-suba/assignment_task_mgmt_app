import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResult, TaskItem, TaskQuery } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly baseUrl = `${environment.apiUrl}/tasks`;

  constructor(private readonly http: HttpClient) {}

  getTasks(query: TaskQuery): Observable<PagedResult<TaskItem>> {
    let params = new HttpParams();
    if (query.status) {
      params = params.set('status', query.status);
    }
    if (query.priority) {
      params = params.set('priority', query.priority);
    }
    if (query.search) {
      params = params.set('search', query.search);
    }
    if (query.dueBefore) {
      params = params.set('dueBefore', query.dueBefore);
    }
    if (query.sort) {
      params = params.set('sort', query.sort);
    }
    if (query.page) {
      params = params.set('page', query.page.toString());
    }
    if (query.pageSize) {
      params = params.set('pageSize', query.pageSize.toString());
    }

    return this.http.get<PagedResult<TaskItem>>(this.baseUrl, { params });
  }

  createTask(payload: Partial<TaskItem>): Observable<TaskItem> {
    return this.http.post<TaskItem>(this.baseUrl, payload);
  }

  updateTask(id: string, payload: Partial<TaskItem>): Observable<TaskItem> {
    return this.http.put<TaskItem>(`${this.baseUrl}/${id}`, payload);
  }

  toggleComplete(id: string, isComplete: boolean): Observable<TaskItem> {
    return this.http.patch<TaskItem>(`${this.baseUrl}/${id}/complete`, { isComplete });
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
