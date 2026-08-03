import { rxResource } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import {
  SalesHistoryControls,
  SalesHistoryFilterBy,
  SalesHistoryFilterRange,
  SalesHistorySortBy,
  SalesHistorySortDirection,
} from '../../components/sales-history-page-components/sales-history-controls/sales-history-controls';
import { SalesHistoryHeader } from '../../components/sales-history-page-components/sales-history-header/sales-history-header';
import { SalesHistoryList } from '../../components/sales-history-page-components/sales-history-list/sales-history-list';
import { SalesHistoryPagination } from '../../components/sales-history-page-components/sales-history-pagination/sales-history-pagination';
import { SalesHistoryStats } from '../../components/sales-history-page-components/sales-history-stats/sales-history-stats';
import { SalesHistoryService, SalesQuery, SalesStatsQuery } from '../../services/sales-history-service';

@Component({
  selector: 'app-sales-history-page',
  imports: [
    SalesHistoryControls,
    SalesHistoryHeader,
    SalesHistoryStats,
    SalesHistoryList,
    SalesHistoryPagination,
  ],
  templateUrl: './sales-history-page.html',
  styleUrl: './sales-history-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesHistoryPage {
  private readonly salesService = inject(SalesHistoryService);

  readonly query = signal<SalesQuery>({
    page: 0,
    size: 10,
    search: '',
    sortBy: '',
    sortDirection: '',
    filterBy: 'totalRevenue',
    filterFrom: '',
    filterTo: '',
  });

  readonly statsQuery = computed<SalesStatsQuery>(() => {
    const query = this.query();

    return {
      search: query.search,
      filterBy: query.filterBy,
      filterFrom: query.filterFrom,
      filterTo: query.filterTo,
    };
  });

  readonly sales = rxResource({
    params: () => this.query(),
    stream: ({ params }) => this.salesService.getSalesHistory(params),
  });

  readonly stats = rxResource({
    params: () => this.statsQuery(),
    stream: ({ params }) => this.salesService.getSalesStats(params)
  })

  readonly displayedPage = signal(1);
  readonly displayedPageCount = signal(1);

  constructor() {
    effect(() => {
      if (!this.sales.hasValue()) return;
      const response = this.sales.value();
      if (response) {
        this.displayedPage.set(response.currentPage + 1);
        this.displayedPageCount.set(Math.max(response.totalPages, 1));
      }
    });
  }

  setPage(page: number) {
    if (this.sales.isLoading()) return;
    this.query.update((query) => ({ ...query, page: page - 1 }));
  }

  setSize(size: number) {
    if (this.sales.isLoading()) return;
    this.query.update((query) => ({ ...query, page: 0, size }));
  }

  setSearch(search: string) {
    if (this.requestIsRunning()) return;
    this.query.update((query) => ({ ...query, page: 0, search }));
  }

  setSortBy(sortBy: SalesHistorySortBy) {
    if (this.requestIsRunning()) return;
    this.query.update((query) => ({ ...query, page: 0, sortBy }));
  }

  setSortDirection(sortDirection: SalesHistorySortDirection) {
    if (this.requestIsRunning()) return;
    this.query.update((query) => ({
      ...query,
      page: 0,
      sortDirection,
    }));
  }

  setFilterBy(filterBy: SalesHistoryFilterBy) {
    this.query.update((query) => ({ ...query, page: 0, filterBy }));
  }

  setFilterRange({ filterBy, filterFrom, filterTo }: SalesHistoryFilterRange) {
    if (this.requestIsRunning()) return;
    this.query.update((query) => ({
      ...query,
      page: 0,
      filterBy,
      filterFrom,
      filterTo,
    }));
  }

  exportCsv(): void {
    const sales = this.sales.hasValue() ? this.sales.value().items : [];
    const rows = sales.map((sale) => [sale.id, sale.cashierName, sale.createdAt, sale.totalRevenue,
      sale.totalCost, sale.totalProfit, sale.marginPercent, sale.saleItems.length]);
    this.downloadCsv('sales-history.csv', [
      ['Sale ID', 'Cashier', 'Date', 'Revenue', 'Cost', 'Profit', 'Margin %', 'Items'], ...rows,
    ]);
  }

  private downloadCsv(filename: string, rows: readonly (readonly unknown[])[]): void {
    const csv = rows.map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(','))
      .join('\r\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  private requestIsRunning(): boolean {
    return this.sales.isLoading() || this.stats.isLoading();
  }
}
