import { ChangeDetectionStrategy, Component, output } from '@angular/core';
@Component({ selector: 'app-sales-history-header', templateUrl: './sales-history-header.html', styleUrl: './sales-history-header.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class SalesHistoryHeader { readonly exportRequested = output<void>(); }
