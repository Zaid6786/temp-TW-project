import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
    
    // Initialize mock database if not already present
    if (!localStorage.getItem('mock_students')) {
      const defaultStudents = [
        { studentId: 1, name: 'John Doe', email: 'john@college.edu', rollNo: 'student123', password: 'password' },
        { studentId: 2, name: 'Alice Smith', email: 'alice@college.edu', rollNo: '2021001', password: 'password' }
      ];
      localStorage.setItem('mock_students', JSON.stringify(defaultStudents));
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
        catchError(err => {
          console.error('Admin login failed:', err);
          return throwError(() => new Error('Invalid admin credentials'));
        })
      );
  }

  studentLogin(studentId: string, password: string): Observable<any> {
    // Send email/rollNo as the email field in Spring Boot's LoginRequest payload
    return this.http.post<any>(`${this.apiUrl}/student/login`, { email: studentId, password: password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          }
        }),
        catchError(err => {
          console.error('Student login failed:', err);
          return throwError(() => new Error('Invalid student credentials'));
        })
      );
  }

  driverLogin(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/driver/login`, { username, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify({ ...response.user, role: 'DRIVER' }));
            this.currentUserSubject.next({ ...response.user, role: 'DRIVER' });
          }
        }),
        catchError(err => {
          console.error('Driver login failed:', err);
          return throwError(() => new Error('Invalid driver credentials'));
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

