import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseCalculatorSidebar } from './expense-calculator-sidebar';

describe('ExpenseCalculatorSidebar', () => {
  let component: ExpenseCalculatorSidebar;
  let fixture: ComponentFixture<ExpenseCalculatorSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseCalculatorSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseCalculatorSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
