import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

export type SalesHistorySortBy = 'date' | 'revenue' | 'profit' | 'margin';
export type SalesHistorySortDirection = 'asc' | 'desc';
export type SalesHistoryFilterBy = 'revenue' | 'cost' | 'profit' | 'margin';

@Component({
  selector: 'app-sales-history-controls',
  imports: [ReactiveFormsModule],
  templateUrl: './sales-history-controls.html',
  styleUrl: './sales-history-controls.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesHistoryControls {
  readonly queryChanged = output<string>();
  readonly sortByChanged = output<SalesHistorySortBy>();
  readonly sortDirectionChanged = output<SalesHistorySortDirection>();
  readonly filterByChanged = output<SalesHistoryFilterBy>();
  readonly filterFromChanged = output<number | null>();
  readonly filterToChanged = output<number | null>();

  readonly queryControl = new FormControl('', { nonNullable: true });

  constructor() {
    this.queryControl.valueChanges.subscribe((query) => {
      this.queryChanged.emit(query.trim());
    });
  }

  onSortByChange(event: Event) {
    const value = (event.target as HTMLSelectElement)
      .value as SalesHistorySortBy;

    this.sortByChanged.emit(value);
  }

  onSortDirectionChange(event: Event) {
    const value = (event.target as HTMLSelectElement)
      .value as SalesHistorySortDirection;

    this.sortDirectionChanged.emit(value);
  }

  onFilterByChange(event: Event) {
    const value = (event.target as HTMLSelectElement)
      .value as SalesHistoryFilterBy;

    this.filterByChanged.emit(value);
  }

  onFilterFromChange(event: Event) {
    this.filterFromChanged.emit(this.numberOrNull(event));
  }

  onFilterToChange(event: Event) {
    this.filterToChanged.emit(this.numberOrNull(event));
  }

  private numberOrNull(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    return value === '' ? null : Number(value);
  }
}
