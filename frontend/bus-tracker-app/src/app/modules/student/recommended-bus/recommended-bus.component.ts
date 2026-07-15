import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../services/student/student.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-recommended-bus',
  templateUrl: './recommended-bus.component.html',
  styleUrls: ['./recommended-bus.component.scss']
})
export class RecommendedBusComponent implements OnInit {
  assignedBus: any = null;
  studentId: number = 1;
  loading: boolean = true;

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

    this.studentService.getAssignedBus(this.studentId).subscribe({
      next: (bus) => {
        if (bus) {
          this.assignedBus = bus;
        } else {
          // Fallback if none assigned
          this.assignedBus = null;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
