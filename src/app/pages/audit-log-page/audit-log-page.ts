import { Component } from '@angular/core';
import { AuditLogHeader } from '../../components/audit-log-page-components/audit-log-header/audit-log-header';
import { AuditLogStats } from '../../components/audit-log-page-components/audit-log-stats/audit-log-stats';
import { AuditLogList } from '../../components/audit-log-page-components/audit-log-list/audit-log-list';

@Component({
  selector: 'app-audit-log-page',
  imports: [AuditLogHeader, AuditLogStats, AuditLogList],
  templateUrl: './audit-log-page.html',
  styleUrl: './audit-log-page.scss',
})
export class AuditLogPage {

}
