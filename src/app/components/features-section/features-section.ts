import { Component } from '@angular/core';

@Component({
  selector: 'app-features-section',
  imports: [],
  templateUrl: './features-section.html',
  styleUrl: './features-section.scss',
})
export class FeaturesSection {
  features = [
    {
      title: 'Dynamic Schema',
      description: 'Define custom product fields that match your business needs. Add sizes, colors, expiry dates, and more.',
      icon: 'schema'
    },
    {
      title: 'Profit Guard',
      description: 'Real-time wholesale vs. retail margin tracking to maximize profitability on every sale.',
      icon: 'profit'
    },
    {
      title: 'Cashier-First UI',
      description: 'Speed-optimized checkout interface designed for high-traffic stores and quick transactions.',
      icon: 'cashier'
    }
  ];
}
