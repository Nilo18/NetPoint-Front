import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseCalculator } from './expense-calculator';

describe('ExpenseCalculator', () => {
  let component: ExpenseCalculator;
  let fixture: ComponentFixture<ExpenseCalculator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseCalculator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseCalculator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
