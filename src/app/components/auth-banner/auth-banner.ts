import { Component } from '@angular/core';

@Component({
  selector: 'app-auth-banner',
  imports: [],
  templateUrl: './auth-banner.html',
  styleUrl: './auth-banner.scss',
})
export class AuthBanner {
  bannerFeatures: any = [
    {
      id: 1,
      heading: 'Real-time Analytics',
      paragraph: 'Track sales, expenses, and profits in real-time with comprehensive dashboards.'
    },
    {
      id: 2,
      heading: 'Customizable Schema',
      paragraph: 'Build custom product attributes tailored to your unique business needs.'
    },
    {
      id: 3,
      heading: 'Role-Based Access',
      paragraph: 'Secure cashier and admin roles with optimized interfaces for each user type.'
    },
  ]
}
