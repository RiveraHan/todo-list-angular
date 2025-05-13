import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private baseUrl = `${environment.apiBaseUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl);
  }

  getTasksByUser(userId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/${userId}`);
  }

  createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}`, {
      ...task,
      userId
    });
  }

  updateTask(id: string, task: Partial<Task> & { userId: string }): Observable<Task> {
    console.log('Updating task:', task);
    return this.http.put<Task>(`${this.baseUrl}/${id}`, task);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
