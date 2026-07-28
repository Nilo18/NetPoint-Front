import { Component, signal, WritableSignal } from '@angular/core';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { PricingPageHeading } from '../../components/pricing-page-components/pricing-page-heading/pricing-page-heading';
import { PricingPagePlanCards } from '../../components/pricing-page-components/pricing-page-plan-cards/pricing-page-plan-cards';
import { PricingPageBillingFaq } from '../../components/pricing-page-components/pricing-page-billing-faq/pricing-page-billing-faq';
import { PricingPageSignupCta } from '../../components/pricing-page-components/pricing-page-signup-cta/pricing-page-signup-cta';
import { PricingPagePlanComparisonTable } from '../../components/pricing-page-components/pricing-page-plan-comparison-table/pricing-page-plan-comparison-table';

@Component({
  selector: 'app-pricing-page',
  imports: [
    Header,
    PricingPageHeading,
    PricingPagePlanCards,
    PricingPagePlanComparisonTable,
    PricingPageBillingFaq,
    PricingPageSignupCta,
    Footer
  ],
  templateUrl: './pricing-page.html',
  styleUrl: './pricing-page.scss',
})
export class PricingPage {
  priceMode: WritableSignal<string> = signal('Monthly')

  handlePriceModeChange(event: string) {
    console.log(event)
    this.priceMode.set(event)
  }
}
