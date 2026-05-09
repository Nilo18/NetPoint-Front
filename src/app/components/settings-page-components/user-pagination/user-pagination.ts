import { Component, inject } from '@angular/core';
import { SettingsPageService } from '../../../services/settings-page-service';

@Component({
  selector: 'app-user-pagination',
  imports: [],
  templateUrl: './user-pagination.html',
  styleUrl: './user-pagination.scss',
})
export class UserPagination {
  public settingsService = inject(SettingsPageService)

  get pageArray() {
    return Array.from({ length: this.settingsService.totalPages() }, (_, i) => i + 1)
  }
}
