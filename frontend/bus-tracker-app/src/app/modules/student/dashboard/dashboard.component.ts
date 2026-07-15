import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../services/student/student.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  student: any = {};
  assignedBus: any = null;
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
      this.student = data || { name: 'Student', route: 'Route A' };
    });

    this.studentService.getAssignedBus(this.studentId).subscribe(bus => {
      this.assignedBus = bus;
    });
  }
}
