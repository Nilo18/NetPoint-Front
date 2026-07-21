import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-audit-log-header',
  imports: [],
  templateUrl: './audit-log-header.html',
  styleUrl: './audit-log-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditLogHeader {
  private readonly router = inject(Router);

  navigateToDashboard(): void {
    void this.router.navigate(['/admin']);
  }
}
