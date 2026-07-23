import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AuditLog, AuditLogQuery, AuditLogResponse, AuditLogService, EventType } from '../../../services/audit-log-service';

type EventTone = 'green' | 'purple' | 'blue' | 'orange' | 'red';

interface EventMeta {
  label: string;
  tone: EventTone;
  icon: 'sale' | 'product' | 'team' | 'payment' | 'account';
}

@Component({
  selector: 'app-audit-log-list',
  imports: [DatePipe],
  templateUrl: './audit-log-list.html',
  styleUrl: './audit-log-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditLogList {
  private auditLogService = inject(AuditLogService)
  auditLogsData = resource({
    params: () => this.auditLogService.auditLogQuery(),
    loader: ({ params }) => this.auditLogService.getAuditLogs(params)
  });

  onEventTypeChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value
    this.auditLogService.updateQuery({ eventType: value })
  }

  onRoleChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value
    this.auditLogService.updateQuery({ role: value })
  }

  readonly eventTypes = Object.values(EventType)
  readonly roles = [...new Set(this.auditLogsData.value()?.items.map((log) => log.actorRoleSnapshot))];
  readonly expandedLogId = signal<number | null>(null);

  toggleLog(id: number): void {
    this.expandedLogId.update((expandedId) => (expandedId === id ? null : id));
  }

  getEventMeta(eventType: EventType): EventMeta {
    console.log('Looking for eventType: ', eventType)
    const metadata: Record<EventType, EventMeta> = {
      [EventType.SALE_COMPLETED]: { label: 'Sale Completed', tone: 'green', icon: 'sale' },
      [EventType.PRODUCT_ADDED]: { label: 'Product Added', tone: 'purple', icon: 'product' },
      [EventType.PRODUCT_DELETED]: { label: 'Product Deleted', tone: 'red', icon: 'product' },
      [EventType.USER_INVITED]: { label: 'User Invited', tone: 'purple', icon: 'team' },
      [EventType.TEAM_MEMBER_ADDED]: { label: 'Team Member Added', tone: 'purple', icon: 'team' },
      [EventType.TEAM_MEMBER_REMOVED]: { label: 'Team Member Removed', tone: 'red', icon: 'team' },
      [EventType.COMPANY_DELETED]: { label: 'Company Deleted', tone: 'red', icon: 'account' },
      [EventType.PAYMENT_METHOD_ADDED]: { label: 'Payment Method Added', tone: 'orange', icon: 'payment' },
      [EventType.PAYMENT_METHOD_UPDATED]: { label: 'Payment Method Updated', tone: 'orange', icon: 'payment' },
      [EventType.PAYMENT_METHOD_REMOVED]: { label: 'Payment Method Removed', tone: 'red', icon: 'payment' },
      [EventType.PAYMENT_PLAN_CHANGED]: { label: 'Payment Plan Changed', tone: 'orange', icon: 'payment' },
      [EventType.SUBSCRIPTION_CANCELLED]: { label: 'Subscription Cancelled', tone: 'red', icon: 'payment' },
      [EventType.ACCOUNT_INFO_UPDATED]: { label: 'Account Info Updated', tone: 'blue', icon: 'account' },
      [EventType.COMPANY_INFO_UPDATED]: { label: 'Company Info Updated', tone: 'blue', icon: 'account' },
    };

    console.log('Returning metadata[eventType]: ', metadata[eventType])
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
}
