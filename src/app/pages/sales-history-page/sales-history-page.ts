import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  SalesHistoryControls,
  SalesHistoryFilterBy,
  SalesHistorySortBy,
  SalesHistorySortDirection,
} from '../../components/sales-history-page-components/sales-history-controls/sales-history-controls';
import { SalesHistoryHeader } from '../../components/sales-history-page-components/sales-history-header/sales-history-header';
import { SalesHistoryList } from '../../components/sales-history-page-components/sales-history-list/sales-history-list';
import { SalesHistoryPagination } from '../../components/sales-history-page-components/sales-history-pagination/sales-history-pagination';
import { SalesHistoryStats } from '../../components/sales-history-page-components/sales-history-stats/sales-history-stats';
import {
  SaleRecord,
  SalesHistoryService,
} from '../../services/sales-history-service';

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
  private readonly service = inject(SalesHistoryService);

  readonly allSales = this.service.sales;
  readonly query = signal('');
  readonly sortBy = signal<SalesHistorySortBy>('date');
  readonly direction = signal<SalesHistorySortDirection>('desc');
  readonly filterBy = signal<SalesHistoryFilterBy>('revenue');
  readonly filterFrom = signal<number | null>(null);
  readonly filterTo = signal<number | null>(null);
  readonly page = signal(1);
  readonly pageSize = 5;

  readonly filteredSales = computed(() => {
    const query = this.query().toLowerCase();
    const from = this.filterFrom();
    const to = this.filterTo();
    const filterBy = this.filterBy();

    return this.allSales
      .filter((sale) => {
        const searchableText = `${sale.id} ${sale.cashier} ${sale.items
          .map((item) => item.name)
          .join(' ')}`.toLowerCase();
        const filterValue = this.value(sale, filterBy);

        return (
          (!query || searchableText.includes(query)) &&
          (from === null || filterValue >= from) &&
          (to === null || filterValue <= to)
        );
      })
      .sort((firstSale, secondSale) => {
        const difference =
          this.value(firstSale, this.sortBy()) -
          this.value(secondSale, this.sortBy());

        return difference * (this.direction() === 'asc' ? 1 : -1);
      });
  });

  readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.filteredSales().length / this.pageSize)),
  );

  readonly visibleSales = computed(() =>
    this.filteredSales().slice(
      (this.page() - 1) * this.pageSize,
      this.page() * this.pageSize,
    ),
  );

  setQuery(query: string) {
    this.query.set(query);
    this.page.set(1);
  }

  setSortBy(sortBy: SalesHistorySortBy) {
    this.sortBy.set(sortBy);
    this.page.set(1);
  }

  setDirection(direction: SalesHistorySortDirection) {
    this.direction.set(direction);
    this.page.set(1);
  }

  setFilterBy(filterBy: SalesHistoryFilterBy) {
    this.filterBy.set(filterBy);
    this.page.set(1);
  }

  setFrom(filterFrom: number | null) {
    this.filterFrom.set(filterFrom);
    this.page.set(1);
  }

  setTo(filterTo: number | null) {
    this.filterTo.set(filterTo);
    this.page.set(1);
  }

  exportCsv() {
    const rows = [
      [
        'Sale ID',
        'Cashier',
        'Date',
        'Items',
        'Revenue',
        'Cost',
        'Profit',
        'Margin',
      ],
      ...this.filteredSales().map((sale) => [
        sale.id,
        sale.cashier,
        sale.completedAt,
        sale.items.length,
        sale.revenue,
        sale.cost,
        this.profit(sale),
        this.margin(sale).toFixed(1),
      ]),
    ];
    const csv = rows
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
          .join(','),
      )
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const link = document.createElement('a');

    link.href = url;
    link.download = 'sales-history.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  private profit(sale: SaleRecord) {
    return sale.revenue - sale.cost;
  }

  private margin(sale: SaleRecord) {
    return sale.revenue ? (this.profit(sale) / sale.revenue) * 100 : 0;
  }

  private value(
    sale: SaleRecord,
    key: SalesHistorySortBy | SalesHistoryFilterBy,
  ) {
    if (key === 'date') {
      return new Date(sale.completedAt).getTime();
    }

    if (key === 'profit') {
      return this.profit(sale);
    }

    if (key === 'margin') {
      return this.margin(sale);
    }

    return sale[key];
  }
}
