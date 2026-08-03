import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

export type SalesHistorySortBy = 'date' | 'revenue' | 'profit' | 'margin';
export type SalesHistorySortDirection = 'asc' | 'desc';
export type SalesHistoryFilterBy =   
  | 'date'
  | 'totalRevenue'
  | 'totalCost'
  | 'totalProfit'
  | 'marginPercent';

export interface SalesHistoryFilterRange {
  readonly filterBy: SalesHistoryFilterBy;
  readonly filterFrom: string;
  readonly filterTo: string;
}

@Component({
  selector: 'app-sales-history-controls',
  imports: [ReactiveFormsModule],
  templateUrl: './sales-history-controls.html',
  styleUrl: './sales-history-controls.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesHistoryControls {
  readonly searchChanged = output<string>();
  readonly sortByChanged = output<SalesHistorySortBy>();
  readonly sortDirectionChanged = output<SalesHistorySortDirection>();
  readonly filterByChanged = output<SalesHistoryFilterBy>();
  readonly filterRangeChanged = output<SalesHistoryFilterRange>();
  readonly loading = input(false);
  private destroyRef = inject(DestroyRef)

  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly filterRange = signal<SalesHistoryFilterRange>({
    filterBy: 'totalRevenue',
    filterFrom: '',
    filterTo: '',
  });
  private rangeWasApplied = false;

  constructor() {
    effect(() => {
      if (this.loading()) {
        this.searchControl.disable({ emitEvent: false });
      } else {
        this.searchControl.enable({ emitEvent: false });
      }
    });

    this.searchControl.valueChanges
    .pipe(
      debounceTime(250),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe((query) => {
      this.searchChanged.emit(query.trim());
    });
  }

  onSortByChange(event: Event) {
    if (this.loading()) return;
    const value = (event.target as HTMLSelectElement)
      .value as SalesHistorySortBy;

    this.sortByChanged.emit(value);
  }

  onSortDirectionChange(event: Event) {
    if (this.loading()) return;
    const value = (event.target as HTMLSelectElement)
      .value as SalesHistorySortDirection;

    this.sortDirectionChanged.emit(value);
  }

  onFilterByChange(event: Event) {
    if (this.loading()) return;
    const value = (event.target as HTMLSelectElement)
      .value as SalesHistoryFilterBy;

    this.filterRange.set({ filterBy: value, filterFrom: '', filterTo: '' });
    this.rangeWasApplied = false;
  }

  onFilterFromChange(event: Event) {
    if (this.loading()) return;
    this.filterRange.update((range) => ({
      ...range,
      filterFrom: (event.target as HTMLInputElement).value,
    }));
    this.emitCompleteRangeOrReset();
  }

  onFilterToChange(event: Event) {
    if (this.loading()) return;
    this.filterRange.update((range) => ({
      ...range,
      filterTo: (event.target as HTMLInputElement).value,
    }));
    this.emitCompleteRangeOrReset();
  }

  private emitCompleteRangeOrReset() {
    const range = this.filterRange();
    const rangeIsComplete = range.filterFrom !== '' && range.filterTo !== '';
    const rangeWasCleared = range.filterFrom === '' && range.filterTo === '';

    if (rangeIsComplete) {
      this.rangeWasApplied = true;
      this.filterRangeChanged.emit(range);
      return;
    }

    if (rangeWasCleared && this.rangeWasApplied) {
      this.rangeWasApplied = false;
      this.filterRangeChanged.emit(range);
    }
  }
}
