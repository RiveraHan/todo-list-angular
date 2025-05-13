import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, catchError, switchMap, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `${environment.apiBaseUrl}/users`;
  userWasCreated = new Subject<void>();

  constructor(private http: HttpClient) {}

  loginOrRegister(email: string): Observable<{ id: string; email: string }> {
    return this.http.get<{ id: string; email: string }>(`${this.baseUrl}/${email}`).pipe(
      switchMap(user => of(user)),

      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.userWasCreated.next();
          return this.register(email);
        } else {
          throw error;
        }
      })
    );
  }

  private register(email: string): Observable<{ id: string; email: string }> {
    return this.http.post<{ id: string; email: string }>(this.baseUrl, { email });
  }
}
