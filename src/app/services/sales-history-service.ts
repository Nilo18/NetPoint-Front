import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { BackendUrlHolderService } from './backend-url-holder-service';
import { tap } from 'rxjs';

export interface SaleItem {
  readonly productId: number;
  readonly productName: string;
  readonly quantity: number;
  readonly unitRetailPrice: number;
  readonly lineRevenue: number;
}

// export interface SaleRecord {
//   readonly id: number;
//   readonly cashier: string;
//   readonly completedAt: string;
//   readonly revenue: number;
//   readonly cost: number;
//   readonly items: readonly SaleItem[];
// }

export interface SalesQuery {
  page: number,
  size: number,
  search: string,
  sortBy: string,
  sortDirection: string,
  filterBy: string,
  filterFrom : string,
  filterTo: string
}

export interface SalesStatsQuery {
  search: string,
  filterBy: string,
  filterFrom : string,
  filterTo: string
}

export interface Sale {
  id: number;
  cashierName: string;
  createdAt: string; // ISO 8601 string format
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  marginPercent: number;
  saleItems: SaleItem[];
}

export interface SalesResponse {
  currentPage: number;
  items: Sale[];
  page: number;
  size: number;
  totalPages: number;
}

export interface SalesStatsResponse {
  totalSales: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  marginPercent: number;
}

@Injectable({ providedIn: 'root' })
export class SalesHistoryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrlHolder = inject(BackendUrlHolderService);
  private readonly baseUrl = this.baseUrlHolder.getBaseUrl();

  // readonly sales = signal<readonly SaleRecord[]>([]);

  getSalesHistory(salesQuery: SalesQuery) {
    let httpParams = new HttpParams()
      .set('page', salesQuery.page)
      .set('size', salesQuery.size)
      .set('search', salesQuery.search)
      .set('sortBy', salesQuery.sortBy)
      .set('sortDirection', salesQuery.sortDirection)

    if (salesQuery.filterFrom !== '' && salesQuery.filterTo !== '') {
      httpParams = httpParams
        .set('filterBy', salesQuery.filterBy)
        .set('filterFrom', salesQuery.filterFrom)
        .set('filterTo', salesQuery.filterTo);
    }

    return this.http.get<SalesResponse>(`${this.baseUrl}/api/sales`, {
      params: httpParams
    }).pipe(tap({
      next: response => console.log(response),
      error: error => console.log("Couldn't get sales history: ", error)
    }));
  }

  getSalesStats(statsQuery: SalesStatsQuery) {
    let httpParams = new HttpParams()
      .set('search', statsQuery.search)

    if (statsQuery.filterFrom !== '' && statsQuery.filterTo !== '') {
      httpParams = httpParams
        .set('filterBy', statsQuery.filterBy)
        .set('filterFrom', statsQuery.filterFrom)
        .set('filterTo', statsQuery.filterTo);
    }

    return this.http.get<SalesStatsResponse>(`${this.baseUrl}/api/sales/stats`, {
      params: httpParams
    }).pipe(tap({
      next: response => console.log(response),
      error: error => console.log("Couldn't get sales history: ", error)
    }))
  }
}
