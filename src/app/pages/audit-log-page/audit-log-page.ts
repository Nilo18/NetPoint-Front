import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { AuditLogHeader } from '../../components/audit-log-page-components/audit-log-header/audit-log-header';
import { AuditLogStats } from '../../components/audit-log-page-components/audit-log-stats/audit-log-stats';
import { AuditLogList } from '../../components/audit-log-page-components/audit-log-list/audit-log-list';

@Component({
  selector: 'app-audit-log-page',
  imports: [AuditLogHeader, AuditLogStats, AuditLogList],
  templateUrl: './audit-log-page.html',
  styleUrl: './audit-log-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditLogPage {
  private readonly list = viewChild.required(AuditLogList);
  exportCsv(): void { this.list().exportCsv(); }
}
