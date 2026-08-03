import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;
  private studentApiUrl = `${environment.apiUrl}/student`; // Kept for reference

  constructor(private http: HttpClient) { }

  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/dashboard`).pipe(
      catchError(this.handleError<any>('getDashboardStats'))
    );
  }

  // Uses Student API because AdminController didn't implement getAllBuses 
  getAllBuses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/bus/getall`).pipe(
      catchError(this.handleError<any[]>('getAllBuses', []))
    );
  }

  createBus(bus: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/bus/save`, bus).pipe(
      catchError(this.handleError<any>('createBus'))
    );
  }

  updateBus(busId: number, bus: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/bus/update/${busId}`, bus).pipe(
      catchError(this.handleError<any>('updateBus'))
    );
  }

  deleteBus(busId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/bus/delete/${busId}`).pipe(
      catchError(this.handleError<any>('deleteBus'))
    );
  }

  // --- Route APIs ---
  getAllRoutes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/route/getall`).pipe(
      catchError(this.handleError<any[]>('getAllRoutes', []))
    );
  }

  createRoute(route: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/route/save`, route).pipe(
      catchError(this.handleError<any>('createRoute'))
    );
  }

  updateRoute(id: number, route: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/route/update/${id}`, route).pipe(
      catchError(this.handleError<any>('updateRoute'))
    );
  }

  deleteRoute(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/route/delete/${id}`).pipe(
      catchError(this.handleError<any>('deleteRoute'))
    );
  }

  // --- Driver APIs ---
  getAllDrivers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/driver/getall`).pipe(
      catchError(this.handleError<any[]>('getAllDrivers', []))
    );
  }

  createDriver(driver: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/driver/save`, driver).pipe(
      catchError(this.handleError<any>('createDriver'))
    );
  }

  updateDriver(id: number, driver: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/driver/update/${id}`, driver).pipe(
      catchError(this.handleError<any>('updateDriver'))
    );
  }

  deleteDriver(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/driver/delete/${id}`).pipe(
      catchError(this.handleError<any>('deleteDriver'))
    );
  }

  // --- Stop APIs ---
  getAllStops(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/stops/getall`).pipe(
      catchError(this.handleError<any[]>('getAllStops', []))
    );
  }

  createStop(stop: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/stops/save`, stop).pipe(
      catchError(this.handleError<any>('createStop'))
    );
  }

  updateStop(id: number, stop: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/stops/update/${id}`, stop).pipe(
      catchError(this.handleError<any>('updateStop'))
    );
  }

  deleteStop(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/stops/delete/${id}`).pipe(
      catchError(this.handleError<any>('deleteStop'))
    );
  }

  // --- Student APIs ---
  getAllStudents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/student/getall`).pipe(
      catchError(this.handleError<any[]>('getAllStudents', []))
    );
  }

  createStudent(student: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/student/save`, student).pipe(
      catchError(this.handleError<any>('createStudent'))
    );
  }

  updateStudent(id: number, student: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/student/update/${id}`, student).pipe(
      catchError(this.handleError<any>('updateStudent'))
    );
  }

  deleteStudent(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/student/delete/${id}`).pipe(
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
