import { Component } from '@angular/core';
import { SettingsHeader } from '../settings-header/settings-header';
import { SettingsSidebar } from '../settings-sidebar/settings-sidebar';

@Component({
  selector: 'app-business-info',
  imports: [SettingsHeader, SettingsSidebar],
  templateUrl: './business-info.html',
  styleUrl: './business-info.scss',
})
export class BusinessInfo {

}
