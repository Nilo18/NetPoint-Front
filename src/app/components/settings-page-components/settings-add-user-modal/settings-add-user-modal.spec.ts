import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsAddUserModal } from './settings-add-user-modal';

describe('SettingsAddUserModal', () => {
  let component: SettingsAddUserModal;
  let fixture: ComponentFixture<SettingsAddUserModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsAddUserModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsAddUserModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
