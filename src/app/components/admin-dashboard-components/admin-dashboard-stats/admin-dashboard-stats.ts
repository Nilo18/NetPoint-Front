import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, resource } from '@angular/core';
import { ProductService, ProductStats, ProductStatsQuery } from '../../../services/product-service';

type StatTone = 'default' | 'success' | 'warning';
type StatDetailTone = 'muted' | 'positive';

interface DashboardStat {
  readonly title: string;
  readonly value: number | string | undefined;
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
  private productService = inject(ProductService)
  productStats = resource<ProductStats, ProductStatsQuery>({
    params: () => {
      const activeQuery = this.productService.getQuery()(); 
      
      return {
        search: activeQuery.search,
        filterBy: activeQuery.filterBy,
        filterFrom: activeQuery.filterFrom,
        filterTo: activeQuery.filterTo
      };
    },
    loader: ({params}) => this.productService.getProductStats(params)
  })
  readonly backendError = computed(() => this.getErrorMessage(
    this.productStats.error(),
    'We could not load dashboard stats. Please try again.',
  ))
  readonly stats = computed<readonly DashboardStat[]>(() => {
    const productStats = this.productStats.value()
    const increaseRaw = productStats?.increaseFromLastMonth;
    const increasePrefix = typeof increaseRaw === 'number' && increaseRaw > 0 ? '+' : '';
    const increaseDisplay = typeof increaseRaw === 'number' ? `${increasePrefix}${increaseRaw}%` : '...';
    // const marginRaw = productStats?.margin
    // const marginDisplay = 

    return [
      {
        title: 'Total Revenue',
        value: `$${productStats?.totalRevenue ?? '...'}`,
        detail: `${increaseDisplay} from last month`,
        icon: 'currency',
        tone: 'default',
        detailTone: 'positive',
      },
      {
        title: 'Net Profit',
        value: `$${productStats?.netProfit ?? '...'}`,
        detail: `${productStats?.margin ? productStats?.margin + '% margin' : '...'}`,
        icon: 'trend',
        tone: 'success',
        detailTone: 'muted',
      },
      {
        title: 'Top Selling Item',
        value: `${productStats?.topSellingItem ?? '...'}`,
        detail: `${productStats?.unitsSold ? productStats?.unitsSold + ' units sold' : '...'}`,
        icon: 'box',
        tone: 'default',
        detailTone: 'muted',
      },
      {
        title: 'Low Stock Alerts',
        value: `${productStats?.lowStockItemCount ?? '...'}`,
        detail: 'Items below 50 units',
        icon: 'alert',
        tone: 'warning',
        detailTone: 'muted',
      },
    ]
  });

  private getErrorMessage(error: unknown, fallbackMessage: string) {
    if (!error) {
      return null;
    }

    if (error instanceof HttpErrorResponse) {
      const backendMessage = this.extractBackendMessage(error.error);

      return backendMessage || error.message || fallbackMessage;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return fallbackMessage;
  }

  private extractBackendMessage(errorBody: unknown): string | null {
    if (typeof errorBody === 'string') {
      return errorBody;
    }

    if (!errorBody || typeof errorBody !== 'object') {
      return null;
    }

    if ('message' in errorBody && typeof errorBody.message === 'string') {
      return errorBody.message;
    }

    if ('error' in errorBody && typeof errorBody.error === 'string') {
      return errorBody.error;
    }

    if ('title' in errorBody && typeof errorBody.title === 'string') {
      return errorBody.title;
    }

    return null;
  }
}
