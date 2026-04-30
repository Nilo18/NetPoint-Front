import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsRolePermissions } from './settings-role-permissions';

describe('SettingsRolePermissions', () => {
  let component: SettingsRolePermissions;
  let fixture: ComponentFixture<SettingsRolePermissions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsRolePermissions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsRolePermissions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
