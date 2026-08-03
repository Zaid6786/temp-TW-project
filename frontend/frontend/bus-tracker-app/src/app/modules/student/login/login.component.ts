import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  studentId = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router, private authService: AuthService) {}

  onLogin() {
    this.errorMessage = '';
    if (this.studentId && this.password) {
      this.authService.studentLogin(this.studentId, this.password).subscribe({
        next: (res) => {
          this.router.navigate(['/student/dashboard']);
        },
        error: (err) => {
          this.errorMessage = err.message || 'Invalid credentials or Student not registered.';
        }
      });
    }
  }

  navigateToAdmin(event: Event) {
    event.preventDefault();
    this.router.navigate(['/admin/login']);
  }
}

