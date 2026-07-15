import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../services/student/student.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  student: any = {};
  studentId: number = 1;

  constructor(
    private studentService: StudentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user && user.studentId) {
        this.studentId = parseInt(user.studentId.replace(/\D/g, '')) || 1;
      }
    });

    this.studentService.getProfile(this.studentId).subscribe(data => {
      if (data) {
        this.student = data;
      } else {
        // Fallback mock
        this.student = {
          name: 'Alice Smith',
          rollNo: 'STU-2024-001',
          email: 'alice@example.edu',
          phone: '+1 234 567 8901',
          route: 'Route A'
        };
      }
    });
  }

  saveChanges() {
    console.log('Saved changes', this.student);
  }
}
