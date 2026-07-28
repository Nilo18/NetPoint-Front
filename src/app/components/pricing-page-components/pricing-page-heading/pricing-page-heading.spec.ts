import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingPageHeading } from './pricing-page-heading';

describe('PricingPageHeading', () => {
  let component: PricingPageHeading;
  let fixture: ComponentFixture<PricingPageHeading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricingPageHeading]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricingPageHeading);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
