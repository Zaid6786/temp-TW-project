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

  constructor(private router: Router, private authService: AuthService) {}

  onLogin() {
    if (this.studentId && this.password) {
      this.authService.studentLogin(this.studentId, this.password).subscribe(res => {
        this.router.navigate(['/student/dashboard']);
      });
    }
  }
}

