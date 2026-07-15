import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../services/student/student.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];
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
    this.loadNotifications();
  }

  loadNotifications() {
    this.studentService.getNotifications(this.studentId).subscribe(data => {
      if (data && data.length > 0) {
        this.notifications = data;
      } else {
        // Fallback mock
        this.notifications = [
          { notificationId: 101, title: 'Bus Delayed', message: 'Bus #4 on Route A is delayed by 15 mins.', isRead: false, createdAt: new Date().toISOString() },
          { notificationId: 102, title: 'Route Change', message: 'Route C will have a detour today.', isRead: true, createdAt: new Date(Date.now() - 86400000).toISOString() }
        ];
      }
    });
  }

  markAsRead(id: number) {
    this.studentService.markNotificationRead(id).subscribe(() => {
      const index = this.notifications.findIndex(n => n.notificationId === id);
      if (index !== -1) {
        this.notifications[index].isRead = true;
      }
    }, () => {
      // Mock update
      const index = this.notifications.findIndex(n => n.notificationId === id);
      if (index !== -1) {
        this.notifications[index].isRead = true;
      }
    });
  }
}
