import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingPageBillingFaq } from './pricing-page-billing-faq';

describe('PricingPageBillingFaq', () => {
  let component: PricingPageBillingFaq;
  let fixture: ComponentFixture<PricingPageBillingFaq>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricingPageBillingFaq]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricingPageBillingFaq);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
