import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../services/student/student.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  history: any[] = [];
  filteredHistory: any[] = [];
  studentId: number = 1;
  filterDays: number = 7;

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

    this.studentService.getHistory(this.studentId).subscribe(data => {
      if (data && data.length > 0) {
        this.history = data;
      } else {
        // Fallback mock
        this.history = [
          { attendanceId: 1, date: new Date().toISOString(), busId: 4, stopId: 1, type: 'CHECK_IN' },
          { attendanceId: 2, date: new Date(Date.now() - 86400000).toISOString(), busId: 7, stopId: 2, type: 'CHECK_OUT' }
        ];
      }
      this.applyFilter();
    });
  }

  onFilterChange(event: any) {
    this.filterDays = parseInt(event.target.value);
    this.applyFilter();
  }

  applyFilter() {
    if (this.filterDays === 0) {
      this.filteredHistory = this.history;
    } else {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - this.filterDays);
      this.filteredHistory = this.history.filter(h => new Date(h.date) >= cutoff);
    }
  }
}
