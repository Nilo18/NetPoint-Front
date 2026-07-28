import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-compliance-audit',
  templateUrl: './compliance-audit.html',
  styleUrl: './compliance-audit.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplianceAudit {}
