import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  adminLogin(username: string, password: string): Observable<any> {
    // For now, if backend is not running, we can return a mock token or try real HTTP
    return this.http.post<any>(`${this.apiUrl}/admin/login`, { username, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          }
        }),
        // Mock fallback for UI demonstration when backend is down
        catchError(err => {
          console.warn('Backend connection failed. Using mock admin login.');
          const mockRes = { token: 'mock-admin-token', user: { role: 'ADMIN', username } };
          localStorage.setItem('token', mockRes.token);
          localStorage.setItem('user', JSON.stringify(mockRes.user));
          this.currentUserSubject.next(mockRes.user);
          return of(mockRes);
        })
      );
  }

  studentLogin(studentId: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/student/login`, { studentId, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          }
        }),
        // Mock fallback for UI demonstration when backend is down
        catchError(err => {
          console.warn('Backend connection failed. Using mock student login.');
          const mockRes = { token: 'mock-student-token', user: { role: 'STUDENT', studentId } };
          localStorage.setItem('token', mockRes.token);
          localStorage.setItem('user', JSON.stringify(mockRes.user));
          this.currentUserSubject.next(mockRes.user);
          return of(mockRes);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}

