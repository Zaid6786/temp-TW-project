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
        this.studentId = parseInt(String(user.studentId).replace(/\D/g, '')) || user.studentId;
      }
    });

    this.studentService.getProfile(this.studentId).subscribe(data => {
      if (data) {
        this.student = data;
      } else {
        this.student = {
          name: 'Not Found',
          rollNo: '-',
          email: '-',
          department: '-',
          routeId: '-',
          busPassNumber: '-'
        };
      }
    });
  }

  saveChanges() {
    console.log('Saved changes', this.student);
  }
}
