import { Component, inject, resource } from '@angular/core';
import { AuditLogService, AuiditLogStatsQuery } from '../../../services/audit-log-service';

interface AuditLogStat {
  statName: string,
  statNumber: number
}

@Component({
  selector: 'app-audit-log-stats',
  imports: [],
  templateUrl: './audit-log-stats.html',
  styleUrl: './audit-log-stats.scss',
})
export class AuditLogStats {
  private auditLogService = inject(AuditLogService)
  // auditLogStatsQuery: AuiditLogStatsQuery = {
  //   eventType: this.auditLogService.getAuditLogQuery()().eventType,
  //   role: this.auditLogService.getAuditLogQuery()().role,
  //   search: this.auditLogService.getAuditLogQuery()().search
  // }
  auditLogStats = resource({
    params: () => {
      const currentQuery = this.auditLogService.getAuditLogQuery()()
      return {
        eventType: currentQuery.eventType,
        role: currentQuery.role,
        search: currentQuery.search
      }
    },
    loader: ({ params }) => this.auditLogService.getAuditLogStats(params)
  })
  stats: AuditLogStat[] = [
    {
      statName: 'TOTAL EVENTS',
      statNumber: 20
    },
    {
      statName: 'SALES',
      statNumber: 6
    },
    {
      statName: 'PRODUCT CHANGES',
      statNumber: 3
    },
    {
      statName: 'TEAM CHANGES',
      statNumber: 3
    },
    {
      statName: 'PAYMENT CHANGES',
      statNumber: 4
    },
    {
      statName: 'ACCOUNT CHANGES',
      statNumber: 4
    },
  ]
}
