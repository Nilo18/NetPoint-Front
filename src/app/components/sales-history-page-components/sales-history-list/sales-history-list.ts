import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { Sale } from '../../../services/sales-history-service';

@Component({
  selector: 'app-sales-history-list',
  imports: [CurrencyPipe, DatePipe, DecimalPipe],
  templateUrl: './sales-history-list.html',
  styleUrl: './sales-history-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesHistoryList {
  readonly sales = input<readonly Sale[]>([]);
  readonly isLoading = input(false);
  readonly error = input<unknown>(null);
  readonly expandedSaleId = signal<number | null>(null);

  toggle(id: number) {
    this.expandedSaleId.update((current) => (current === id ? null : id));
  }

  relativeTime(createdAt: string) {
    const elapsedMinutes = Math.max(
      0,
      Math.floor((Date.now() - new Date(createdAt).getTime()) / 60_000),
    );

    if (elapsedMinutes < 1) {
      return 'just now';
    }

    if (elapsedMinutes < 60) {
      return `${elapsedMinutes} ${elapsedMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }

    const elapsedHours = Math.floor(elapsedMinutes / 60);
    if (elapsedHours < 24) {
      return `${elapsedHours === 1 ? 'about ' : ''}${elapsedHours} ${elapsedHours === 1 ? 'hour' : 'hours'} ago`;
    }

    const elapsedDays = Math.floor(elapsedHours / 24);
    return `${elapsedDays} ${elapsedDays === 1 ? 'day' : 'days'} ago`;
  }

  lineCost(sale: Sale, lineRevenue: number) {
    return sale.totalRevenue
      ? sale.totalCost * (lineRevenue / sale.totalRevenue)
      : 0;
  }

  unitCost(sale: Sale, lineRevenue: number, quantity: number) {
    return quantity ? this.lineCost(sale, lineRevenue) / quantity : 0;
  }

  lineProfit(sale: Sale, lineRevenue: number) {
    return lineRevenue - this.lineCost(sale, lineRevenue);
  }
}
