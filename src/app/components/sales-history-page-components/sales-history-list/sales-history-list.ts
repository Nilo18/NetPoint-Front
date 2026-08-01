import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { SaleRecord } from '../../../services/sales-history-service';
@Component({ selector: 'app-sales-history-list', imports: [CurrencyPipe, DatePipe, DecimalPipe], templateUrl: './sales-history-list.html', styleUrl: './sales-history-list.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class SalesHistoryList {
  readonly sales = input<readonly SaleRecord[]>([]); readonly expandedSaleId = signal<number | null>(null);
  toggle(id:number){ this.expandedSaleId.update(current => current === id ? null : id); }
  profit(sale:SaleRecord){ return sale.revenue-sale.cost; }
  margin(sale:SaleRecord){ return sale.revenue ? this.profit(sale)/sale.revenue*100 : 0; }
  unitRetail(total:number, quantity:number){ return total/quantity; }
  lineCost(sale:SaleRecord, lineRevenue:number){ return sale.revenue ? sale.cost*(lineRevenue/sale.revenue) : 0; }
  unitCost(sale:SaleRecord, lineRevenue:number, quantity:number){ return this.lineCost(sale,lineRevenue)/quantity; }
  lineProfit(sale:SaleRecord, lineRevenue:number){ return lineRevenue-this.lineCost(sale,lineRevenue); }
}
