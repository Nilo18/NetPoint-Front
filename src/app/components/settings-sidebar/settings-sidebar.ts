import { Component, Type } from '@angular/core';

interface SidebarSection {
  heading: string,
  component: Type<any>
}

@Component({
  selector: 'app-settings-sidebar',
  imports: [],
  templateUrl: './settings-sidebar.html',
  styleUrl: './settings-sidebar.scss',
})
export class SettingsSidebar {
  sidebarSections = [
    {
      heading: 'User Management',
      
    }
  ]
}
