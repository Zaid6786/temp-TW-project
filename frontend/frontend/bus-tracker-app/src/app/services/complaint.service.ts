import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Complaint {
  complaintId?: number;
  studentId: number;
  title: string;
  description: string;
  imageUrl?: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt?: string;
  resolvedAt?: string;
  resolvedBy?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  submitComplaint(studentId: number, title: string, description: string, image?: File): Observable<Complaint> {
    const formData = new FormData();
    formData.append('studentId', studentId.toString());
    formData.append('title', title);
    formData.append('description', description);
    
    if (image) {
      formData.append('image', image, image.name);
    }

    return this.http.post<Complaint>(`${this.apiUrl}/complaint/save`, formData);
  }

  getStudentComplaints(studentId: number): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/complaint/get/${studentId}`);
  }

  getAllComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/complaint/getall`);
  }

  resolveComplaint(complaintId: number, adminId: number): Observable<Complaint> {
    return this.http.put<Complaint>(`${this.apiUrl}/complaint/update/${complaintId}`, {});
  }
}
