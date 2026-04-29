import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { SettingsPageService, User } from '../../services/settings-page-service';
import { jwtDecode } from 'jwt-decode';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-settings-user-management',
  imports: [JsonPipe],
  templateUrl: './settings-user-management.html',
  styleUrl: './settings-user-management.scss',
})
export class SettingsUserManagement {
  private settingsService = inject(SettingsPageService)
  private cdr = inject(ChangeDetectorRef)
  decodedToken!: any
  userList: User[] = []

  async ngOnInit() {
    const token = localStorage.getItem('net_token') 

    if (token) {
      this.decodedToken = jwtDecode(token)
      console.log(this.decodedToken)
      const res = await this.settingsService.getUserlist(Number(this.decodedToken.companyId), 0, 10)
      this.userList = res.userList
      this.cdr.detectChanges()
      console.log('The local userList is: ', this.userList)
    }
  }
}
