import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

type StatTone = 'default' | 'success' | 'warning';
type StatDetailTone = 'muted' | 'positive';

interface DashboardStat {
  readonly title: string;
  readonly value: string;
  readonly detail: string;
  readonly icon: 'currency' | 'trend' | 'box' | 'alert';
  readonly tone: StatTone;
  readonly detailTone: StatDetailTone;
}

@Component({
  selector: 'app-admin-dashboard-stats',
  imports: [],
  templateUrl: './admin-dashboard-stats.html',
  styleUrl: './admin-dashboard-stats.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardStats {
  readonly stats = signal<readonly DashboardStat[]>([
    {
      title: 'Total Revenue',
      value: '$110,561.45',
      detail: '+12.5% from last month',
      icon: 'currency',
      tone: 'default',
      detailTone: 'positive',
    },
    {
      title: 'Net Profit',
      value: '$47,566.45',
      detail: '43.0% margin',
      icon: 'trend',
      tone: 'success',
      detailTone: 'muted',
    },
    {
      title: 'Top Selling Item',
      value: 'Leather Jacket',
      detail: '175 units sold',
      icon: 'box',
      tone: 'default',
      detailTone: 'muted',
    },
    {
      title: 'Low Stock Alerts',
      value: '2',
      detail: 'Items below 50 units',
      icon: 'alert',
      tone: 'warning',
      detailTone: 'muted',
    },
  ]);
}
