import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-audit-log-header',
  imports: [],
  templateUrl: './audit-log-header.html',
  styleUrl: './audit-log-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditLogHeader {
  readonly exportRequested = output<void>();
  private readonly router = inject(Router);

  navigateToDashboard(): void {
    void this.router.navigate(['/admin']);
  }
}
