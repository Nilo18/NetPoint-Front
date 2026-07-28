import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityDetailsPrinciples } from './security-details-principles';

describe('SecurityDetailsPrinciples', () => {
  let component: SecurityDetailsPrinciples;
  let fixture: ComponentFixture<SecurityDetailsPrinciples>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityDetailsPrinciples]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityDetailsPrinciples);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
