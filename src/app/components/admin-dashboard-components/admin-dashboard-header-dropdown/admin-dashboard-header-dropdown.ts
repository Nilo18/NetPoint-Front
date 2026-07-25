import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-admin-dashboard-header-dropdown',
  imports: [RouterLink],
  templateUrl: './admin-dashboard-header-dropdown.html',
  styleUrl: './admin-dashboard-header-dropdown.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardHeaderDropdown {
  private authService = inject(AuthService);

  readonly name = input('');
  readonly role = input('');
  readonly isCashier = computed(() => this.role().trim().toLowerCase() === 'cashier');

  logout(): void {
    this.authService.logout();
  }
}
