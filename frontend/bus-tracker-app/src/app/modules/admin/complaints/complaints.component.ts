import { Component, OnInit } from '@angular/core';
import { ComplaintService, Complaint } from '../../../services/complaint.service';

@Component({
  selector: 'app-admin-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.scss']
})
export class AdminComplaintsComponent implements OnInit {

  complaints: Complaint[] = [];
  adminId = 1; // Hardcoded for now, should come from auth service

  constructor(private complaintService: ComplaintService) { }

  ngOnInit(): void {
    this.loadAllComplaints();
  }

  loadAllComplaints() {
    this.complaintService.getAllComplaints().subscribe({
      next: (data) => this.complaints = data,
      error: (err) => console.error('Error loading all complaints', err)
    });
  }

  resolveComplaint(complaintId: number | undefined) {
    if (!complaintId) return;

    if (confirm('Are you sure you want to mark this issue as resolved?')) {
      this.complaintService.resolveComplaint(complaintId, this.adminId).subscribe({
        next: (updatedComplaint) => {
          const index = this.complaints.findIndex(c => c.complaintId === complaintId);
          if (index !== -1) {
            this.complaints[index] = updatedComplaint;
          }
        },
        error: (err) => console.error('Error resolving complaint', err)
      });
    }
  }
}
