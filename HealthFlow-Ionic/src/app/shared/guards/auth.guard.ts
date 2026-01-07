import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const token = await this.authService.getAuthToken();

    if (token && this.authService.isTokenValid(token)) {
      return true;
    }

    // Redirect to login if no valid token
    this.router.navigate(['/login']);
    return false;
  }
}
