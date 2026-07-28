import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingPagePlanComparisonTable } from './pricing-page-plan-comparison-table';

describe('PricingPagePlanComparisonTable', () => {
  let component: PricingPagePlanComparisonTable;
  let fixture: ComponentFixture<PricingPagePlanComparisonTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricingPagePlanComparisonTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricingPagePlanComparisonTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
