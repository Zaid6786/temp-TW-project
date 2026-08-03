import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-driver-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router, private authService: AuthService) {}

  onLogin() {
    this.errorMessage = '';
    if (this.username && this.password) {
      this.authService.driverLogin(this.username, this.password).subscribe({
        next: (res) => {
          this.router.navigate(['/driver/dashboard']);
        },
        error: (err) => {
          this.errorMessage = err.message || 'Invalid driver credentials.';
        }
      });
    }
  }
}
