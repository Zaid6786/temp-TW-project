import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private router: Router, private authService: AuthService) {}

  onLogin() {
    if (this.username && this.password) {
      this.authService.adminLogin(this.username, this.password).subscribe(res => {
        this.router.navigate(['/admin/dashboard']);
      });
    }
  }
}

