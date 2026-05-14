import { Component, inject, Type } from '@angular/core';
import { SettingsUserManagement } from '../settings-user-management/settings-user-management';
import { BusinessInfo } from '../business-info/business-info';
import { SettingsNotifications } from '../settings-notifications/settings-notifications';
import { SettingsSecurity } from '../settings-security/settings-security';
import { SettingsAppearance } from '../settings-appearance/settings-appearance';
import { SettingsBilling } from '../settings-billing/settings-billing';
import { DomSanitizer } from '@angular/platform-browser';

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
  private sanitizer = inject(DomSanitizer)
  sidebarSections = [
    {
      id: 1,
      heading: 'User Management',
      icon: this.sanitizer.bypassSecurityTrustHtml(
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide
        lucide-user h-5 w-5" data-fg-dvfy500="223.44:249.19782:/src/app/pages/Settings.tsx:761:19:30011:28:e:Icon"
        data-fgid-dvfy500=":rh8:">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
        </svg>`
      ),
      component: SettingsUserManagement,
      isActive: true
    },
    {
      id: 2,
      heading: 'Business Info',
      icon: this.sanitizer.bypassSecurityTrustHtml(
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
      class="lucide lucide-building2 lucide-building-2 h-5 w-5"
      data-fg-dvfy500="223.44:249.19782:/src/app/pages/Settings.tsx:761:19:30011:28:e:Icon"
      data-fgid-dvfy500=":rhb:">
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
      <path d="M10 6h4"></path>
      <path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path>
      </svg>`
      ),
      component: BusinessInfo,
      isActive: false
    },
    {
      id: 3,
      heading: 'Notifications',
      icon: this.sanitizer.bypassSecurityTrustHtml(
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
      class="lucide lucide-bell h-5 w-5"
      data-fg-dvfy500="223.44:249.19782:/src/app/pages/Settings.tsx:761:19:30011:28:e:Icon"
      data-fgid-dvfy500=":rhe:">
      <path d="M10.268 21a2 2 0 0 0 3.464 0"></path>
      <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956
      18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path>
      </svg>`
      ),
      component: SettingsNotifications,
      isActive: false
    },
    {
      id: 4,
      heading: 'Security',
      icon: this.sanitizer.bypassSecurityTrustHtml(
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
      class="lucide lucide-lock h-5 w-5"
      data-fg-dvfy500="223.44:249.19782:/src/app/pages/Settings.tsx:761:19:30011:28:e:Icon"
      data-fgid-dvfy500=":rhh:"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>`
      ),
      component: SettingsSecurity
    },
    {
      id: 5,
      heading: 'Apperance',
      icon: this.sanitizer.bypassSecurityTrustHtml(
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
      class="lucide lucide-palette h-5 w-5"
      data-fg-dvfy500="223.44:249.19782:/src/app/pages/Settings.tsx:761:19:30011:28:e:Icon"
      data-fgid-dvfy500=":rhk:"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5"
      cy="10.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor">
      </circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path
      d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-
      .18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.641.64 0 0 1
      1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
      </svg>`
      ),
      component: SettingsAppearance,
      isActive: false
    },
    {
      id: 6,
      heading: 'Billing & Plans',
      icon: this.sanitizer.bypassSecurityTrustHtml(
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
      class="lucide lucide-credit-card h-5 w-5"
      data-fg-dvfy500="223.44:249.19782:/src/app/pages/Settings.tsx:761:19:30011:28:e:Icon"
      data-fgid-dvfy500=":rhn:">
      <rect width="20" height="14" x="2" y="5" rx="2"></rect>
      <line x1="2" x2="22" y1="10" y2="10"></line>
      </svg>`
      ),
      component: SettingsBilling,
      isActive: false
    }
  ]
}
