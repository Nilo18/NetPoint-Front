import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingPageSignupCta } from './pricing-page-signup-cta';

describe('PricingPageSignupCta', () => {
  let component: PricingPageSignupCta;
  let fixture: ComponentFixture<PricingPageSignupCta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricingPageSignupCta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricingPageSignupCta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
