import { Component, OnInit } from '@angular/core';
import { ComplaintService } from '../../../services/complaint.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.scss']
})
export class ComplaintsComponent implements OnInit {
  title = '';
  description = '';
  selectedRoute = '';
  studentId: number | null = null;
  message = '';

  constructor(
    private complaintService: ComplaintService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user && user.studentId) {
        // Mock a numeric ID based on string or use direct mapping
        this.studentId = parseInt(user.studentId.replace(/\D/g, '')) || 1; 
      }
    });
  }

  onSubmit() {
    if (this.title && this.description && this.studentId) {
      this.complaintService.submitComplaint(this.studentId, this.title, this.description)
        .subscribe({
          next: (res) => {
            this.message = 'Complaint submitted successfully!';
            this.title = '';
            this.description = '';
            this.selectedRoute = '';
          },
          error: (err) => {
            console.error('Error submitting complaint:', err);
            this.message = 'Failed to submit complaint. Please try again.';
          }
        });
    }
  }
}
