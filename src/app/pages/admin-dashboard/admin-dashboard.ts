import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { AdminDashboardHeader } 
from '../../components/admin-dashboard-components/admin-dashboard-header/admin-dashboard-header';
import { AdminDashboardStats } from '../../components/admin-dashboard-components/admin-dashboard-stats/admin-dashboard-stats';
import { AdminDashboardRevenueChart } from '../../components/admin-dashboard-components/admin-dashboard-revenue-chart/admin-dashboard-revenue-chart';
import { AdminDashboardProductPerformanceChart } from '../../components/admin-dashboard-components/admin-dashboard-product-performance-chart/admin-dashboard-product-performance-chart';
import { AdminDashboardInventoryManagement } from '../../components/admin-dashboard-components/admin-dashboard-inventory-management/admin-dashboard-inventory-management';
import { ProductChartData, ProductService } from '../../services/product-service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    AdminDashboardHeader,
    AdminDashboardStats,
    AdminDashboardRevenueChart,
    AdminDashboardProductPerformanceChart,
    AdminDashboardInventoryManagement,
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  private productsService = inject(ProductService);
  readonly charts = signal<ProductChartData>({
    monthlyData: [],
    topSixProducts: []
  });
  readonly chartsLoading = signal(true);
  readonly chartsError = signal<string | null>(null);

  async ngOnInit() {
    this.chartsLoading.set(true);
    this.chartsError.set(null);

    try {
      const res = await this.productsService.getProductCharts();

      if (res) {
        this.charts.set(res);
      }
    } catch (error: unknown) {
      this.chartsError.set('Unable to load chart data. Please try again later.');
    } finally {
      this.chartsLoading.set(false);
    }
  }
}
