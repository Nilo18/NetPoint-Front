import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

interface ProductPerformance {
  readonly label: string;
  readonly sales: number;
}

interface ProductBar {
  readonly label: string;
  readonly x: number;
  readonly y: number;
  readonly height: number;
}

@Component({
  selector: 'app-admin-dashboard-product-performance-chart',
  imports: [],
  templateUrl: './admin-dashboard-product-performance-chart.html',
  styleUrl: './admin-dashboard-product-performance-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardProductPerformanceChart {
  readonly yAxisLabels = signal([22000, 16500, 11000, 5500, 0]);
  readonly gridRows = signal([42, 112, 182, 252, 322]);
  readonly gridColumns = signal([100, 262, 424, 586, 748]);
  readonly products = signal<readonly ProductPerformance[]>([
    { label: 'Denim Jean', sales: 800 },
    { label: 'Leather Ja', sales: 4000 },
    { label: 'Hoodie', sales: 9500 },
    { label: 'Sneakers', sales: 21000 },
    { label: 'Caps', sales: 2400 },
    { label: 'Boots', sales: 5200 },
  ]);

  readonly bars = computed<readonly ProductBar[]>(() => {
    const chartBottom = 322;
    const chartHeight = 280;
    const chartLeft = 134;
    const columnWidth = 108;
    const barWidth = 78;
    const maxValue = 22000;

    return this.products().map((product, index) => {
      const height = (product.sales / maxValue) * chartHeight;

      return {
        label: product.label,
        x: chartLeft + index * columnWidth,
        y: chartBottom - height,
        height,
      };
    });
  });

}
