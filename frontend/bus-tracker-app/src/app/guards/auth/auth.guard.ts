import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Redirect based on the URL attempt
  if (state.url.startsWith('/admin')) {
    return router.createUrlTree(['/admin/login']);
  }
  return router.createUrlTree(['/student/login']);
};
