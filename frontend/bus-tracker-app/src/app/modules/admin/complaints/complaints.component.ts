import { Component, OnInit } from '@angular/core';
import { ComplaintService, Complaint } from '../../../services/complaint.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.scss']
})
export class ComplaintsComponent implements OnInit {
  complaints: Complaint[] = [];
  filteredComplaints: Complaint[] = [];
  statusFilter = 'All Complaints';
  adminId: number = 1;

  constructor(
    private complaintService: ComplaintService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user && user.adminId) {
        this.adminId = user.adminId;
      }
    });
    this.loadComplaints();
  }

  loadComplaints() {
    this.complaintService.getAllComplaints().subscribe({
      next: (data) => {
        this.complaints = data;
        this.filterComplaints();
      },
      error: (err) => {
        console.error('Error fetching complaints:', err);
        // Fallback mock data if backend is offline
        this.complaints = [
          { complaintId: 101, studentId: 1, title: 'Bus Late Arrival', description: 'The bus for Route A was delayed by 30 minutes without any notification.', status: 'PENDING', createdAt: new Date().toISOString() },
          { complaintId: 102, studentId: 2, title: 'Rude Driver', description: 'Driver refused to stop at designated location.', status: 'RESOLVED', createdAt: new Date().toISOString() }
        ];
        this.filterComplaints();
      }
    });
  }

  filterComplaints() {
    if (this.statusFilter === 'All Complaints') {
      this.filteredComplaints = this.complaints;
    } else {
      const statusKey = this.statusFilter === 'Pending' ? 'PENDING' : 'RESOLVED';
      this.filteredComplaints = this.complaints.filter(c => c.status === statusKey);
    }
  }

  onFilterChange(event: any) {
    this.statusFilter = event.target.value;
    this.filterComplaints();
  }

  resolveComplaint(complaintId: number | undefined) {
    if (!complaintId) return;

    this.complaintService.resolveComplaint(complaintId, this.adminId).subscribe({
      next: (updated) => {
        const index = this.complaints.findIndex(c => c.complaintId === complaintId);
        if (index !== -1) {
          this.complaints[index].status = 'RESOLVED';
          this.filterComplaints();
        }
      },
      error: (err) => {
        console.error('Error resolving complaint:', err);
        // Fallback update for mock UI
        const index = this.complaints.findIndex(c => c.complaintId === complaintId);
        if (index !== -1) {
          this.complaints[index].status = 'RESOLVED';
          this.filterComplaints();
        }
      }
    });
  }
}
