import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

interface TrendPoint {
  readonly month: string;
  readonly revenue: number;
  readonly profit: number;
}

interface ChartPoint {
  readonly label: string;
  readonly x: number;
  readonly revenueY: number;
  readonly profitY: number;
}

@Component({
  selector: 'app-admin-dashboard-revenue-chart',
  imports: [],
  templateUrl: './admin-dashboard-revenue-chart.html',
  styleUrl: './admin-dashboard-revenue-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardRevenueChart {
  readonly yAxisLabels = signal([28000, 21000, 14000, 7000, 0]);
  readonly gridRows = signal([42, 112, 182, 252, 322]);
  readonly gridColumns = signal([100, 230, 360, 490, 620, 750]);
  readonly trends = signal<readonly TrendPoint[]>([
    { month: 'Jan', revenue: 12400, profit: 5200 },
    { month: 'Feb', revenue: 15800, profit: 6800 },
    { month: 'Mar', revenue: 18200, profit: 8100 },
    { month: 'Apr', revenue: 21600, profit: 9500 },
    { month: 'May', revenue: 24400, profit: 11200 },
    { month: 'Jun', revenue: 27900, profit: 13100 },
  ]);

  readonly points = computed(() => {
    const chartTop = 42;
    const chartBottom = 322;
    const chartHeight = chartBottom - chartTop;
    const chartLeft = 100;
    const columnWidth = 130;
    const maxValue = 28000;

    return this.trends().map((trend, index) => ({
      label: trend.month,
      x: chartLeft + index * columnWidth,
      revenueY: chartBottom - (trend.revenue / maxValue) * chartHeight,
      profitY: chartBottom - (trend.profit / maxValue) * chartHeight,
    }));
  });

  readonly revenueLinePoints = computed(() => this.toPolylinePoints('revenueY'));
  readonly profitLinePoints = computed(() => this.toPolylinePoints('profitY'));

  private toPolylinePoints(key: 'revenueY' | 'profitY'): string {
    return this.points()
      .map((point) => `${point.x},${point[key]}`)
      .join(' ');
  }
}
