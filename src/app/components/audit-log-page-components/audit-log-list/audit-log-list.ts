import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { AuditLogService, EventType } from '../../../services/audit-log-service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuditLogPagination } from '../audit-log-pagination/audit-log-pagination';

type EventTone = 'green' | 'purple' | 'blue' | 'orange' | 'red' | 'pink';

interface EventMeta {
  label: string;
  tone: EventTone;
  icon: 'sale' | 'product' | 'team' | 'payment' | 'account';
}

@Component({
  selector: 'app-audit-log-list',
  imports: [DatePipe, ReactiveFormsModule, AuditLogPagination],
  templateUrl: './audit-log-list.html',
  styleUrl: './audit-log-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditLogList {
  private readonly auditLogService = inject(AuditLogService);
  private readonly destroyRef = inject(DestroyRef);

  readonly auditLogsData = rxResource({
    params: () => this.auditLogService.auditLogQuery(),
    stream: ({ params }) => this.auditLogService.getAuditLogs(params),
  });
  readonly searchValue = new FormControl('', { nonNullable: true });

  ngOnInit(): void {
    this.searchValue.valueChanges
      .pipe(
        map(query => query.trim()),
        debounceTime(250),
        distinctUntilChanged(),
        tap(search => this.auditLogService.updateQuery({ search })),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  onEventTypeChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value
    this.auditLogService.updateQuery({ eventType: value })
  }

  onRoleChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value
    this.auditLogService.updateQuery({ role: value })
  }

  readonly eventTypes = Object.values(EventType)
  readonly roles = ['Owner', 'Admin', 'Cashier']
  readonly expandedLogId = signal<number | null>(null);

  toggleLog(id: number): void {
    this.expandedLogId.update((expandedId) => (expandedId === id ? null : id));
  }

  getEventMeta(eventType: EventType): EventMeta {
    // console.log('Looking for eventType: ', eventType)
    const metadata: Record<EventType, EventMeta> = {
      [EventType.SALE_COMPLETED]: { label: 'Sale Completed', tone: 'green', icon: 'sale' },
      [EventType.PRODUCT_ADDED]: { label: 'Product Added', tone: 'green', icon: 'product' },
      [EventType.PRODUCT_UPDATED]: { label: 'Product Updated', tone: 'purple', icon: 'product' },
      [EventType.PRODUCT_DELETED]: { label: 'Product Deleted', tone: 'red', icon: 'product' },
      [EventType.USER_INVITED]: { label: 'User Invited', tone: 'purple', icon: 'team' },
      [EventType.TEAM_MEMBER_ADDED]: { label: 'Team Member Added', tone: 'purple', icon: 'team' },
      [EventType.TEAM_MEMBER_REMOVED]: { label: 'Team Member Removed', tone: 'red', icon: 'team' },
      [EventType.COMPANY_DELETED]: { label: 'Company Deleted', tone: 'pink', icon: 'account' },
      [EventType.PAYMENT_METHOD_ADDED]: { label: 'Payment Method Added', tone: 'orange', icon: 'payment' },
      [EventType.PAYMENT_METHOD_UPDATED]: { label: 'Payment Method Updated', tone: 'orange', icon: 'payment' },
      [EventType.PAYMENT_METHOD_REMOVED]: { label: 'Payment Method Removed', tone: 'red', icon: 'payment' },
      [EventType.PAYMENT_PLAN_CHANGED]: { label: 'Payment Plan Changed', tone: 'orange', icon: 'payment' },
      [EventType.SUBSCRIPTION_CANCELLED]: { label: 'Subscription Cancelled', tone: 'red', icon: 'payment' },
      [EventType.ACCOUNT_INFO_UPDATED]: { label: 'Account Info Updated', tone: 'blue', icon: 'account' },
      [EventType.COMPANY_INFO_UPDATED]: { label: 'Company Info Updated', tone: 'pink', icon: 'account' },
    };

    // console.log('Returning metadata[eventType]: ', metadata[eventType])
    return metadata[eventType];
  }

  getEventTypeName(eventType: EventType): string {
    return EventType[eventType];
  }

  getRelativeTime(value: Date | string): string {
    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
      return 'Unknown date';
    }

    const elapsedMinutes = Math.max(
      0,
      Math.floor((Date.now() - date.getTime()) / 60_000),
    );


    if (elapsedMinutes < 1) return 'just now';
    if (elapsedMinutes < 60) return `${elapsedMinutes} minute${elapsedMinutes === 1 ? '' : 's'} ago`;

    const hours = Math.floor(elapsedMinutes / 60);
    if (hours < 24) return `about ${hours} hour${hours === 1 ? '' : 's'} ago`;

    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }

  handlePageChange(displayPage: number): void {
    this.auditLogService.updateQuery({ page: displayPage - 1 });
  }

  retryLoad(): void {
    this.auditLogsData.reload();
  }
}
