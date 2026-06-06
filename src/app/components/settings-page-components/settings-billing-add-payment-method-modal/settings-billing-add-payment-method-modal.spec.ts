import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsBillingAddPaymentMethodModal } from './settings-billing-add-payment-method-modal';

describe('SettingsBillingAddPaymentMethodModal', () => {
  let component: SettingsBillingAddPaymentMethodModal;
  let fixture: ComponentFixture<SettingsBillingAddPaymentMethodModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsBillingAddPaymentMethodModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsBillingAddPaymentMethodModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
