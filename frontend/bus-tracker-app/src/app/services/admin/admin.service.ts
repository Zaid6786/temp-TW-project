import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/api/admin';
  private studentApiUrl = 'http://localhost:8080/api/student'; // Re-use student buses api for getting all buses for admin

  constructor(private http: HttpClient) { }

  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard`).pipe(
      catchError(this.handleError<any>('getDashboardStats'))
    );
  }

  // Uses Student API because AdminController didn't implement getAllBuses 
  getAllBuses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.studentApiUrl}/buses`).pipe(
      catchError(this.handleError<any[]>('getAllBuses', []))
    );
  }

  createBus(bus: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/bus`, bus).pipe(
      catchError(this.handleError<any>('createBus'))
    );
  }

  updateBus(busId: number, bus: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/bus/${busId}`, bus).pipe(
      catchError(this.handleError<any>('updateBus'))
    );
  }

  deleteBus(busId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/bus/${busId}`).pipe(
      catchError(this.handleError<any>('deleteBus'))
    );
  }

  // --- Route APIs ---
  getAllRoutes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/route`).pipe(
      catchError(this.handleError<any[]>('getAllRoutes', []))
    );
  }

  createRoute(route: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/route`, route).pipe(
      catchError(this.handleError<any>('createRoute'))
    );
  }

  updateRoute(id: number, route: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/route/${id}`, route).pipe(
      catchError(this.handleError<any>('updateRoute'))
    );
  }

  deleteRoute(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/route/${id}`).pipe(
      catchError(this.handleError<any>('deleteRoute'))
    );
  }

  // --- Driver APIs ---
  getAllDrivers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/driver`).pipe(
      catchError(this.handleError<any[]>('getAllDrivers', []))
    );
  }

  createDriver(driver: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/driver`, driver).pipe(
      catchError(this.handleError<any>('createDriver'))
    );
  }

  updateDriver(id: number, driver: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/driver/${id}`, driver).pipe(
      catchError(this.handleError<any>('updateDriver'))
    );
  }

  deleteDriver(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/driver/${id}`).pipe(
      catchError(this.handleError<any>('deleteDriver'))
    );
  }

  // --- Stop APIs ---
  getAllStops(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/stop`).pipe(
      catchError(this.handleError<any[]>('getAllStops', []))
    );
  }

  createStop(stop: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/stop`, stop).pipe(
      catchError(this.handleError<any>('createStop'))
    );
  }

  updateStop(id: number, stop: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/stop/${id}`, stop).pipe(
      catchError(this.handleError<any>('updateStop'))
    );
  }

  deleteStop(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/stop/${id}`).pipe(
      catchError(this.handleError<any>('deleteStop'))
    );
  }

  // --- Student APIs ---
  getAllStudents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/student`).pipe(
      catchError(this.handleError<any[]>('getAllStudents', []))
    );
  }

  createStudent(student: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/student`, student).pipe(
      catchError(this.handleError<any>('createStudent'))
    );
  }

  updateStudent(id: number, student: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/student/${id}`, student).pipe(
      catchError(this.handleError<any>('updateStudent'))
    );
  }

  deleteStudent(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/student/${id}`).pipe(
      catchError(this.handleError<any>('deleteStudent'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
