import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard {
  private router = inject(Router)
  private authService = inject(AuthService)

  logout() {
    this.authService.logout()
  }

  navToSettings() {
    this.router.navigate(['/settings'])
  }
}
