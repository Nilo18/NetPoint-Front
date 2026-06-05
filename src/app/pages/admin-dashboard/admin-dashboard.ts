import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { AdminDashboardHeader } 
from '../../components/admin-dashboard-components/admin-dashboard-header/admin-dashboard-header';
import { AdminDashboardStats } from '../../components/admin-dashboard-components/admin-dashboard-stats/admin-dashboard-stats';
import { AdminDashboardRevenueChart } from '../../components/admin-dashboard-components/admin-dashboard-revenue-chart/admin-dashboard-revenue-chart';
import { AdminDashboardProductPerformanceChart } from '../../components/admin-dashboard-components/admin-dashboard-product-performance-chart/admin-dashboard-product-performance-chart';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    AdminDashboardHeader,
    AdminDashboardStats,
    AdminDashboardRevenueChart,
    AdminDashboardProductPerformanceChart,
  ],
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
