import { Component, effect, ElementRef, HostListener, Renderer2, signal, viewChild, ViewChild } from '@angular/core';
import { SettingsHeader } from '../../components/settings-page-components/settings-header/settings-header';
import { SettingsUserManagement } from '../../components/settings-page-components/settings-user-management/settings-user-management';
import { SettingsRolePermissions } from '../../components/settings-page-components/settings-role-permissions/settings-role-permissions';
import { SettingsSidebar } from '../../components/settings-page-components/settings-sidebar/settings-sidebar';
import { UserTable } from '../../components/settings-page-components/user-table/user-table';

@Component({
  selector: 'app-settings',
  imports: [SettingsHeader, SettingsUserManagement, /*SettingsRolePermissions,*/ SettingsSidebar],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {

}
