import { Component, inject } from '@angular/core';
import { SettingsPageService } from '../../services/settings-page-service';

@Component({
  selector: 'app-settings-user-management',
  imports: [],
  templateUrl: './settings-user-management.html',
  styleUrl: './settings-user-management.scss',
})
export class SettingsUserManagement {
  private settingsService = inject(SettingsPageService)
  accessToken!: string

  async ngOnInit() {
    const token = localStorage.getItem('net_token') 
    // await this.settingsService.getUserlist()
  }
}
