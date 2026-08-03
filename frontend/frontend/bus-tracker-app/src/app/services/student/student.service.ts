import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getProfile(studentId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/student/get/${studentId}`).pipe(
      catchError(this.handleError<any>('getProfile'))
    );
  }

  getAllBuses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/bus/getall`).pipe(
      catchError(this.handleError<any[]>('getAllBuses', []))
    );
  }

  getBusDetails(busId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/bus/get/${busId}`).pipe(
      catchError(this.handleError<any>('getBusDetails'))
    );
  }

  getBusLocation(busId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/buslocation/get/${busId}`).pipe(
      catchError(this.handleError<any>('getBusLocation'))
    );
  }

  getBusOccupancy(busId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/busoccupancy/get/${busId}`).pipe(
      catchError(this.handleError<any>('getBusOccupancy'))
    );
  }

  getAssignedBus(studentId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/studentbusassignment/get/${studentId}`).pipe(
      catchError(this.handleError<any>('getAssignedBus'))
    );
  }

  getNotifications(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/notifications/${studentId}`).pipe(
      catchError(this.handleError<any[]>('getNotifications', []))
    );
  }

  markNotificationRead(notificationId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/notification/${notificationId}/read`, {}).pipe(
      catchError(this.handleError<any>('markNotificationRead'))
    );
  }

  getHistory(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/history/${studentId}`).pipe(
      catchError(this.handleError<any[]>('getHistory', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
