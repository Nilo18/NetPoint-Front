import { inject, Injectable, signal } from '@angular/core';
import { BackendUrlHolderService } from './backend-url-holder-service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom, Observable, tap } from 'rxjs';

export enum EventType {
  SALE_COMPLETED = 'SALE_COMPLETED',
  PRODUCT_ADDED = 'PRODUCT_ADDED',
  PRODUCT_DELETED = 'PRODUCT_DELETED',
  USER_INVITED = 'USER_INVITED',
  TEAM_MEMBER_ADDED = 'TEAM_MEMBER_ADDED',
  TEAM_MEMBER_REMOVED = 'TEAM_MEMBER_REMOVED',
  COMPANY_DELETED = 'COMPANY_DELETED',
  PAYMENT_METHOD_ADDED = 'PAYMENT_METHOD_ADDED',
  PAYMENT_METHOD_UPDATED = 'PAYMENT_METHOD_UPDATED',
  PAYMENT_METHOD_REMOVED = 'PAYMENT_METHOD_REMOVED',
  PAYMENT_PLAN_CHANGED = 'PAYMENT_PLAN_CHANGED',
  SUBSCRIPTION_CANCELLED = 'SUBSCRIPTION_CANCELLED',
  ACCOUNT_INFO_UPDATED = 'ACCOUNT_INFO_UPDATED',
  COMPANY_INFO_UPDATED = 'COMPANY_INFO_UPDATED',
}

export interface AuditLog {
  id: number;
  eventType: EventType;
  details: string;
  actorNameSnapshot: string;
  actorRoleSnapshot: string;
  occurredAt: Date;
}

export interface AuditLogQuery {
  page: number,
  size: number,
  eventType: string,
  role: string,
  search: string
}

export interface AuditLogResponse {
  currentPage: number,
  items: AuditLog[],
  page: number,
  size: number,
  totalPages: number
}

export interface AuditLogStatsResponse {
  totalEvents: number;
  sales: number;
  productChanges: number;
  teamChanges: number;
  paymentChanges: number;
  accountChanges: number;
  companyChanges: number;
}

export interface AuiditLogStatsQuery {
  eventType: string,
  role: string,
  search: string
}

@Injectable({
  providedIn: 'root',
})
export class AuditLogService {
  private backendUrlHolderService = inject(BackendUrlHolderService)
  private http = inject(HttpClient)
  private baseUrl: string = this.backendUrlHolderService.getBaseUrl()
  auditLogQuery = signal<AuditLogQuery>({
    page: 0,
    size: 10,
    eventType: '',
    role: '',
    search: ''
  })

  getAuditLogQuery() {
    return this.auditLogQuery
  }

  updateQuery(patch: Partial<AuditLogQuery>) {
    this.auditLogQuery.update(current => ({
      ...current,
      ...patch,
      page: patch.page !== undefined ? patch.page : 0
    }))
  }
  
   getAuditLogs(auditLogQuery: AuditLogQuery): Observable<AuditLogResponse> {
    const params = new HttpParams()
    .set("page", auditLogQuery.page)
    .set("size", auditLogQuery.size)
    .set("eventType", auditLogQuery.eventType)
    .set("role", auditLogQuery.role)
    .set("search", auditLogQuery.search)
    // try {
    const res = this.http.get<AuditLogResponse>(
      `${this.baseUrl}/api/audit-logs`,
      { params },
    ).pipe(
      tap({
        next: response => {
          console.log(response)
          console.log([...new Set(response.items.map((log) => log.actorRoleSnapshot))])
        },
        error: error => console.log("Couldn't get audit logs: ", error)
      })
    );
    // console.log(res.subscribe(value => console.log(value)))
    return res
    // } catch (error) {
      // console.log("Couldn't get audit logs: ", error)
      // throw error
    // }
  }

  async getAuditLogStats(auditLogStatsQuery: AuiditLogStatsQuery) {
    const httpParams = new HttpParams()
    .set("eventType", auditLogStatsQuery.eventType)
    .set("role", auditLogStatsQuery.role)
    .set("search", auditLogStatsQuery.search)
    try {
      const res = await firstValueFrom(this.http.get<AuditLogStatsResponse>(`${this.baseUrl}/api/audit-logs/stats`, {
        params: httpParams
      }))
      console.log(res)
      return res
    } catch (error) {
      console.log("Couldn't get audit log stats: ", error)
      throw error
    }
  }
}
