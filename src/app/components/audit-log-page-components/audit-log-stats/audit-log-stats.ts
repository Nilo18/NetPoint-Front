import { Component, computed, inject, resource } from '@angular/core';
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
  stats = computed(() => {
    const logStats = this.auditLogStats.value()

    return [{
      statName: 'TOTAL EVENTS',
      statNumber: logStats?.totalEvents
    },
    {
      statName: 'SALES',
      statNumber: logStats?.sales
    },
    {
      statName: 'PRODUCT CHANGES',
      statNumber: logStats?.productChanges
    },
    {
      statName: 'TEAM CHANGES',
      statNumber: logStats?.teamChanges
    },
    {
      statName: 'PAYMENT CHANGES',
      statNumber: logStats?.paymentChanges
    },
    {
      statName: 'ACCOUNT CHANGES',
      statNumber: logStats?.accountChanges
    },
  ]})
}
