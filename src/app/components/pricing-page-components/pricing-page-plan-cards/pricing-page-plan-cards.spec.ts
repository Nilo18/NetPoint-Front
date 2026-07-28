import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingPagePlanCards } from './pricing-page-plan-cards';

describe('PricingPagePlanCards', () => {
  let component: PricingPagePlanCards;
  let fixture: ComponentFixture<PricingPagePlanCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricingPagePlanCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricingPagePlanCards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
