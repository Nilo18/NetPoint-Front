import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierLoginForm } from './cashier-login-form';

describe('CashierLoginForm', () => {
  let component: CashierLoginForm;
  let fixture: ComponentFixture<CashierLoginForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashierLoginForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashierLoginForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
