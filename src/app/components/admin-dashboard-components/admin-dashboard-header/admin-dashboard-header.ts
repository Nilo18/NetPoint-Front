import { ChangeDetectionStrategy, Component, ElementRef, inject, resource, signal, viewChild } from '@angular/core';
import { CompanyService } from '../../../services/company-service';
import { AdminDashboardHeaderDropdown } from '../admin-dashboard-header-dropdown/admin-dashboard-header-dropdown';

@Component({
  selector: 'app-admin-dashboard-header',
  imports: [AdminDashboardHeaderDropdown],
  templateUrl: './admin-dashboard-header.html',
  styleUrl: './admin-dashboard-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'closeDropdownOnOutsideClick($event)',
  },
})
export class AdminDashboardHeader {
  private companyService = inject(CompanyService)
  private readonly profile = viewChild<ElementRef<HTMLElement>>('profile')

  companyUserPayload = resource({
    loader: () => this.companyService.getCompanyUserPayload()
  });
  readonly showDropdown = signal(false)

  setShowDropdown(val: boolean): void {
    this.showDropdown.set(val)
  }

  closeDropdownOnOutsideClick(event: MouseEvent): void {
    const target = event.target

    if (target instanceof Node && !this.profile()?.nativeElement.contains(target)) {
      this.showDropdown.set(false)
    }
  }
}
