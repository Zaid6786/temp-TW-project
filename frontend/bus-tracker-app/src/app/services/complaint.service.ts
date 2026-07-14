import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  private apiUrl = 'http://localhost:8080/api/complaints';

  constructor(private http: HttpClient) { }

  submitComplaint(studentId: number, title: string, description: string, image?: File): Observable<Complaint> {
    const formData = new FormData();
    formData.append('studentId', studentId.toString());
    formData.append('title', title);
    formData.append('description', description);
    
    if (image) {
      formData.append('image', image, image.name);
    }

    return this.http.post<Complaint>(this.apiUrl, formData);
  }

  getStudentComplaints(studentId: number): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/student/${studentId}`);
  }

  getAllComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(this.apiUrl);
  }

  resolveComplaint(complaintId: number, adminId: number): Observable<Complaint> {
    return this.http.put<Complaint>(`${this.apiUrl}/${complaintId}/resolve?adminId=${adminId}`, {});
  }
}
