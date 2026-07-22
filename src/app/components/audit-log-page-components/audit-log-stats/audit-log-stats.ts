import { Component } from '@angular/core';

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
