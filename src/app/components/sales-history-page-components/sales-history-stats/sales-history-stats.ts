import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Sale, SalesStatsResponse } from '../../../services/sales-history-service';

@Component({
  selector: 'app-sales-history-stats',
  imports: [CurrencyPipe, DecimalPipe],
  templateUrl: './sales-history-stats.html',
  styleUrl: './sales-history-stats.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesHistoryStats {
  readonly sales = input<readonly Sale[]>([]);
  readonly stats = input<SalesStatsResponse | undefined>()
  readonly isLoading = input(false);
  readonly error = input<unknown>(null);
  readonly revenue = computed(() =>
    this.sales().reduce((total, sale) => total + sale.totalRevenue, 0),
  );
  readonly profit = computed(() =>
    this.sales().reduce((total, sale) => total + sale.totalProfit, 0),
  );
  readonly margin = computed(() =>
    this.revenue() ? (this.profit() / this.revenue()) * 100 : 0,
  );
}
