import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { AdminDashboardHeader } 
from '../../components/admin-dashboard-components/admin-dashboard-header/admin-dashboard-header';
import { AdminDashboardStats } from '../../components/admin-dashboard-components/admin-dashboard-stats/admin-dashboard-stats';

@Component({
  selector: 'app-admin-dashboard',
  imports: [AdminDashboardHeader, AdminDashboardStats],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard {
  // private router = inject(Router)
  // private authService = inject(AuthService)

  // logout() {
  //   this.authService.logout()
  // }

  // navToSettings() {
  //   this.router.navigate(['/settings'])
  // }
}
