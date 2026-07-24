import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-audit-log-pagination',
  imports: [],
  templateUrl: './audit-log-pagination.html',
  styleUrl: './audit-log-pagination.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditLogPagination {
  readonly currentPage = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly loading = input(false);
  readonly pageChange = output<number>();

  readonly visiblePages = computed(() => {
    const totalPages = this.totalPages();
    const visiblePageCount = Math.min(totalPages, 10);
    const maximumStart = Math.max(1, totalPages - visiblePageCount + 1);
    const start = Math.min(
      Math.max(1, this.currentPage() - Math.floor(visiblePageCount / 2)),
      maximumStart,
    );

    return Array.from({ length: visiblePageCount }, (_, index) => start + index);
  });

  changePage(page: number): void {
    const totalPages = this.totalPages();

    if (this.loading() || totalPages <= 1) {
      return;
    }

    const wrappedPage = page < 1 ? totalPages : page > totalPages ? 1 : page;

    if (wrappedPage !== this.currentPage()) {
      this.pageChange.emit(wrappedPage);
    }
  }
}
