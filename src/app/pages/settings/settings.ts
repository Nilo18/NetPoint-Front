import { Component, effect, ElementRef, HostListener, Renderer2, signal, viewChild, ViewChild } from '@angular/core';
import { SettingsHeader } from '../../components/settings-header/settings-header';
import { SettingsUserManagement } from '../../components/settings-user-management/settings-user-management';
import { SettingsRolePermissions } from '../../components/settings-role-permissions/settings-role-permissions';
import { SettingsSidebar } from '../../components/settings-sidebar/settings-sidebar';

@Component({
  selector: 'app-settings',
  imports: [SettingsHeader, SettingsUserManagement, SettingsRolePermissions, SettingsSidebar],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  // // 1. Create the viewChild signal
  // settings = viewChild<ElementRef>('settings');
  
  // // 2. A signal to track viewport height changes (zoom/resize)
  // viewportHeight = signal(window.innerHeight);

  // constructor(private renderer: Renderer2) {
  //   // 3. Effect runs whenever 'settings' or 'viewportHeight' changes
  //   effect(() => {
  //     const el = this.settings()?.nativeElement;
  //     const height = this.viewportHeight();
      
  //     if (el) {
  //       this.renderer.setStyle(el, 'height', `${height}px`);
  //     }
  //   });
  // }

  // private lastOuterWidth = window.outerWidth;

  // @HostListener('window:resize')
  // onResize() {
  //   const currentHeight = window.innerHeight;
    
  //   // Calculate the zoom factor
  //   // Most browsers: outerWidth / innerWidth
  //   const zoomFactor = window.outerWidth / window.innerWidth;

  //   // If the console is opened, the height changes but the zoom factor stays the same.
  //   // If zooming happens, the factor changes.
  //   if (zoomFactor !== 1) {
  //     this.viewportHeight.set(currentHeight);
  //   }
  // }
}
