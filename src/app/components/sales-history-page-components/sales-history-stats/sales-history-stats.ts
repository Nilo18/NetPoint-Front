import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SaleRecord } from '../../../services/sales-history-service';
@Component({ selector: 'app-sales-history-stats', imports: [CurrencyPipe, DecimalPipe], templateUrl: './sales-history-stats.html', styleUrl: './sales-history-stats.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class SalesHistoryStats { readonly sales = input<readonly SaleRecord[]>([]); readonly revenue = computed(() => this.sales().reduce((sum,sale)=>sum+sale.revenue,0)); readonly profit = computed(() => this.sales().reduce((sum,sale)=>sum+sale.revenue-sale.cost,0)); readonly margin = computed(() => this.revenue() ? this.profit()/this.revenue()*100 : 0); }
