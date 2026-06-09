import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseCalculatorProductList } from './expense-calculator-product-list';

describe('ExpenseCalculatorProductList', () => {
  let component: ExpenseCalculatorProductList;
  let fixture: ComponentFixture<ExpenseCalculatorProductList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseCalculatorProductList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseCalculatorProductList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
