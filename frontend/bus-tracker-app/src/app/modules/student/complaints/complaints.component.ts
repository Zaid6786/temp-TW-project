import { Component, OnInit } from '@angular/core';
import { ComplaintService, Complaint } from '../../../services/complaint.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-student-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.scss']
})
export class StudentComplaintsComponent implements OnInit {

  complaints: Complaint[] = [];
  complaintForm: FormGroup;
  selectedFile: File | null = null;
  studentId = 1; // Hardcoded for now, should come from auth service
  
  showForm = false;
  isSubmitting = false;

  constructor(
    private complaintService: ComplaintService,
    private fb: FormBuilder
  ) {
    this.complaintForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadComplaints();
  }

  loadComplaints() {
    this.complaintService.getStudentComplaints(this.studentId).subscribe({
      next: (data) => this.complaints = data,
      error: (err) => console.error('Error loading complaints', err)
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit() {
    if (this.complaintForm.valid) {
      this.isSubmitting = true;
      const { title, description } = this.complaintForm.value;
      
      this.complaintService.submitComplaint(this.studentId, title, description, this.selectedFile || undefined)
        .subscribe({
          next: (res) => {
            this.complaints.unshift(res);
            this.showForm = false;
            this.complaintForm.reset();
            this.selectedFile = null;
            this.isSubmitting = false;
          },
          error: (err) => {
            console.error('Submit error', err);
            this.isSubmitting = false;
          }
        });
    }
  }
}
