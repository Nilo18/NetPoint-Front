import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsBusinessInfoValidatorModal } from './settings-business-info-validator-modal';

describe('SettingsBusinessInfoValidatorModal', () => {
  let component: SettingsBusinessInfoValidatorModal;
  let fixture: ComponentFixture<SettingsBusinessInfoValidatorModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsBusinessInfoValidatorModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsBusinessInfoValidatorModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
