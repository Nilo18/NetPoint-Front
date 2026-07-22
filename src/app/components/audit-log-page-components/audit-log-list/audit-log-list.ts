import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

enum EventType {
  SALE_COMPLETED,
  PRODUCT_ADDED,
  PRODUCT_DELETED,
  USER_INVITED,
  TEAM_MEMBER_ADDED,
  TEAM_MEMBER_REMOVED,
  COMPANY_DELETED,
  PAYMENT_METHOD_ADDED,
  PAYMENT_METHOD_UPDATED,
  PAYMENT_METHOD_REMOVED,
  PAYMENT_PLAN_CHANGED,
  SUBSCRIPTION_CANCELLED,
  ACCOUNT_INFO_UPDATED,
  COMPANY_INFO_UPDATED,
}

interface AuditLog {
  id: number;
  eventType: EventType;
  details: string;
  actorNameSnapshot: string;
  actorRoleSnapshot: string;
  occurredAt: Date;
}

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
  readonly auditLogs: AuditLog[] = [
    {
      id: 1,
      eventType: EventType.SALE_COMPLETED,
      details: 'Sale #1042 — $128.50 — 4 items (Wireless Mouse, USB-C Hub, Notebook, Pen Set)',
      actorNameSnapshot: 'Maria Santos',
      actorRoleSnapshot: 'Cashier',
      occurredAt: new Date(),
    },
    {
      id: 2,
      eventType: EventType.PRODUCT_ADDED,
      details: 'Added product "Ergonomic Keyboard Pro" — Retail $89.99, Wholesale $42.00, Stock 50',
      actorNameSnapshot: 'James Reyes',
      actorRoleSnapshot: 'Admin',
      occurredAt: new Date(Date.now() - 18 * 60_000),
    },
    {
      id: 3,
      eventType: EventType.ACCOUNT_INFO_UPDATED,
      details: 'Updated email from alex.old@demo.com to alex@demo.com',
      actorNameSnapshot: 'Alex Kim',
      actorRoleSnapshot: 'Owner',
      occurredAt: new Date(Date.now() - 35 * 60_000),
    },
    {
      id: 4,
      eventType: EventType.SALE_COMPLETED,
      details: 'Sale #1041 — $47.00 — 2 items (HDMI Cable, Screen Cleaner)',
      actorNameSnapshot: 'Maria Santos',
      actorRoleSnapshot: 'Cashier',
      occurredAt: new Date(Date.now() - 60 * 60_000),
    },
    {
      id: 5,
      eventType: EventType.TEAM_MEMBER_ADDED,
      details: 'Added cashier Priya Nair (priya@demo.com) to the team',
      actorNameSnapshot: 'Alex Kim',
      actorRoleSnapshot: 'Owner',
      occurredAt: new Date(Date.now() - 2 * 60 * 60_000),
    },
    {
      id: 6,
      eventType: EventType.PAYMENT_METHOD_ADDED,
      details: 'Added Visa card ending in 4242 as default payment method',
      actorNameSnapshot: 'Alex Kim',
      actorRoleSnapshot: 'Owner',
      occurredAt: new Date(Date.now() - 3 * 60 * 60_000),
    },
    {
      id: 7,
      eventType: EventType.PRODUCT_DELETED,
      details: 'Deleted product "Legacy Barcode Reader" (SKU: BR-001)',
      actorNameSnapshot: 'James Reyes',
      actorRoleSnapshot: 'Admin',
      occurredAt: new Date(Date.now() - 5 * 60 * 60_000),
    },
    {
      id: 8,
      eventType: EventType.SALE_COMPLETED,
      details: 'Sale #1040 — $215.00 — 1 item (Standing Desk Mat)',
      actorNameSnapshot: 'Priya Nair',
      actorRoleSnapshot: 'Cashier',
      occurredAt: new Date(Date.now() - 6 * 60 * 60_000),
    },
  ];

  readonly eventTypes = Object.values(EventType).filter(
    (value): value is EventType => typeof value === 'number',
  );
  readonly roles = [...new Set(this.auditLogs.map((log) => log.actorRoleSnapshot))];
  readonly searchTerm = signal('');
  readonly selectedEventType = signal<EventType | null>(null);
  readonly selectedRole = signal('');
  readonly expandedLogId = signal<number | null>(null);

  readonly filteredLogs = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    const eventType = this.selectedEventType();
    const role = this.selectedRole();

    return this.auditLogs.filter((log) => {
      const matchesQuery =
        !query ||
        [
          log.actorNameSnapshot,
          log.actorRoleSnapshot,
          log.details,
          this.getEventMeta(log.eventType).label,
        ].some((value) => value.toLowerCase().includes(query));

      return (
        matchesQuery &&
        (eventType === null || log.eventType === eventType) &&
        (!role || log.actorRoleSnapshot === role)
      );
    });
  });

  setSearchTerm(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  setEventType(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedEventType.set(value === '' ? null : (Number(value) as EventType));
  }

  setRole(event: Event): void {
    this.selectedRole.set((event.target as HTMLSelectElement).value);
  }

  toggleLog(id: number): void {
    this.expandedLogId.update((expandedId) => (expandedId === id ? null : id));
  }

  getEventMeta(eventType: EventType): EventMeta {
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

    return metadata[eventType];
  }

  getEventTypeName(eventType: EventType): string {
    return EventType[eventType];
  }

  getRelativeTime(date: Date): string {
    const elapsedMinutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60_000));

    if (elapsedMinutes < 1) return 'just now';
    if (elapsedMinutes < 60) return `${elapsedMinutes} minute${elapsedMinutes === 1 ? '' : 's'} ago`;

    const hours = Math.floor(elapsedMinutes / 60);
    if (hours < 24) return `about ${hours} hour${hours === 1 ? '' : 's'} ago`;

    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }
}
