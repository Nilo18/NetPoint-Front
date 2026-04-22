import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsUserManagement } from './settings-user-management';

describe('SettingsUserManagement', () => {
  let component: SettingsUserManagement;
  let fixture: ComponentFixture<SettingsUserManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsUserManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsUserManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
