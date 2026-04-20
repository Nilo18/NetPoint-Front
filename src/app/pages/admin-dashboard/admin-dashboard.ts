import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard {
  private router = inject(Router)

  logout() {
    localStorage.removeItem('net_token')
    this.router.navigate(['/'])
  }
}
