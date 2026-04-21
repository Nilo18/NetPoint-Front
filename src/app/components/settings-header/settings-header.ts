import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings-header',
  imports: [],
  templateUrl: './settings-header.html',
  styleUrl: './settings-header.scss',
})
export class SettingsHeader {
  private router = inject(Router)

  navToAdmin() {
    this.router.navigate(['/admin'])
  }
}
