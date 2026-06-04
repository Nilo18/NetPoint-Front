import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsBillingPlanChangerModal } from './settings-billing-plan-changer-modal';

describe('SettingsBillingPlanChangerModal', () => {
  let component: SettingsBillingPlanChangerModal;
  let fixture: ComponentFixture<SettingsBillingPlanChangerModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsBillingPlanChangerModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsBillingPlanChangerModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
