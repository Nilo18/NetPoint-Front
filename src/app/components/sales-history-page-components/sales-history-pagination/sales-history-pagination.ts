import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-sales-history-pagination',
  templateUrl: './sales-history-pagination.html',
  styleUrl: './sales-history-pagination.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesHistoryPagination {
  readonly page = input(1);
  readonly pageCount = input(1);
  readonly pageChanged = output<number>();

  readonly visiblePages = computed(() => {
    const totalPages = this.pageCount();

    if (totalPages <= 10) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const startPage = Math.min(
      Math.max(this.page() - 4, 1),
      totalPages - 9,
    );

    return Array.from({ length: 10 }, (_, index) => startPage + index);
  });

  selectPage(page: number) {
    if (page < 1 || page > this.pageCount() || page === this.page()) {
      return;
    }

    this.pageChanged.emit(page);
  }
}
