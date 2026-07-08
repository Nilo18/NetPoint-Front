import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MonthlyFinancials } from '../../../services/product-service';

@Component({
  selector: 'app-admin-dashboard-revenue-chart',
  imports: [BaseChartDirective],
  templateUrl: './admin-dashboard-revenue-chart.html',
  styleUrl: './admin-dashboard-revenue-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardRevenueChart {
  readonly trends = input<readonly MonthlyFinancials[]>([]);
  readonly loading = input(false);
  readonly errorMessage = input<string | null>(null);

  private readonly yAxisBounds = computed(() => {
    const values = this.trends().flatMap((trend) => [trend.revenue, trend.profit]);
    const maxValue = Math.max(0, ...values);
    const range = maxValue || 1;
    const padding = range * 0.08;

    return {
      min: -padding,
      max: maxValue + padding,
    };
  });

  readonly lineChartData = computed<ChartConfiguration<'line'>['data']>(() => ({
    labels: this.trends().map((trend) => trend.month),
    datasets: [
      {
        label: 'Revenue',
        data: this.trends().map((trend) => trend.revenue),
        borderColor: '#4f46f8',
        backgroundColor: '#ffffff',
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#4f46f8',
        pointBorderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 5,
        borderWidth: 3,
        tension: 0,
        clip: false,
      },
      {
        label: 'Profit',
        data: this.trends().map((trend) => trend.profit),
        borderColor: '#10b981',
        backgroundColor: '#ffffff',
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#10b981',
        pointBorderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 5,
        borderWidth: 3,
        tension: 0,
        clip: false,
      },
    ],
  }));

  readonly lineChartOptions = computed<ChartOptions<'line'>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 8,
        right: 8,
        bottom: 8,
        left: 4,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y?.toLocaleString() ?? '0';

            return `${context.dataset.label}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        offset: true,
        grid: {
          color: '#d1d5db',
        },
        ticks: {
          color: '#555f6d',
          font: {
            size: 16,
          },
        },
      },
      y: {
        min: this.yAxisBounds().min,
        max: this.yAxisBounds().max,
        ticks: {
          color: '#555f6d',
          font: {
            size: 16,
          },
          callback: (value) => {
            const numericValue = Number(value);

            return numericValue < 0 ? '' : numericValue.toLocaleString();
          },
        },
        grid: {
          color: '#d1d5db',
        },
      },
    },
  }));
}
