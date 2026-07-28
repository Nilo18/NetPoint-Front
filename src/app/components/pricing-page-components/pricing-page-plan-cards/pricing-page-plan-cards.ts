import { Component, input } from '@angular/core';

interface Plan {
  name: string,
  customerIntent: string,
  pricePerMonth: number,
  pricePerYear: number,
  conditions: string[]
}

@Component({
  selector: 'app-pricing-page-plan-cards',
  imports: [],
  templateUrl: './pricing-page-plan-cards.html',
  styleUrl: './pricing-page-plan-cards.scss',
})
export class PricingPagePlanCards {
  cardPriceMode = input<string>()
  plans: Plan[] = [
    {
      name: 'Starter',
      customerIntent: 'For small shops getting started',
      pricePerMonth: 0,
      pricePerYear: 0,
      conditions: [
        'Up to 100 products in catalog',
        '5 team members',
        'Standard sales reports',
        '7-day activity log retention'
      ]
    },
    {
      name: 'Professional',
      customerIntent: 'For growing businesses',
      pricePerMonth: 49,
      pricePerYear: 588, // Calculated as $49 * 12 months
      conditions: [
        'Unlimited products',
        'Up to 10 team members',
        'Advanced analytics',
        '30-day activity log retention'
      ]
    },
    {
      name: 'Business Plus',
      customerIntent: 'For large-scale operations',
      pricePerMonth: 99,
      pricePerYear: 1188, // Calculated as $99 * 12 months
      conditions: [
        'Unlimited products',
        'Unlimited team members',
        'Full audit suite',
        '90-day activity log retention'
      ]
    }
  ];
}
