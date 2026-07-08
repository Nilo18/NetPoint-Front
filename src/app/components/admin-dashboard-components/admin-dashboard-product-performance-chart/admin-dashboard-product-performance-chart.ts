import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TopProfitableItem } from '../../../services/product-service';

@Component({
  selector: 'app-admin-dashboard-product-performance-chart',
  imports: [BaseChartDirective],
  templateUrl: './admin-dashboard-product-performance-chart.html',
  styleUrl: './admin-dashboard-product-performance-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardProductPerformanceChart {
  readonly products = input<readonly TopProfitableItem[]>([]);
  readonly loading = input(false);
  readonly errorMessage = input<string | null>(null);

  readonly barChartData = computed<ChartConfiguration<'bar'>['data']>(() => {
    return {
      labels: this.products().map((product) => product.productName),
      datasets: [
        {
          label: 'Profit',
          data: this.products().map((product) => product.productProfit),
          backgroundColor: '#18b987',
          borderColor: '#0f9f74',
          borderRadius: 6,
          borderSkipped: false,
          borderWidth: 1,
          maxBarThickness: 72,
        },
      ],
    };
  });

  readonly barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y?.toLocaleString() ?? '0';

            return `Profit: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: '#d1d5db',
        },
        ticks: {
          color: '#555f6d',
          font: {
            size: 14,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#d1d5db',
        },
        ticks: {
          color: '#555f6d',
          font: {
            size: 14,
          },
        },
      },
    },
  };
}
