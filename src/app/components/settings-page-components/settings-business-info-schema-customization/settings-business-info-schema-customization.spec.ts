import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsBusinessInfoSchemaCustomization } from './settings-business-info-schema-customization';

describe('SettingsBusinessInfoSchemaCustomization', () => {
  let component: SettingsBusinessInfoSchemaCustomization;
  let fixture: ComponentFixture<SettingsBusinessInfoSchemaCustomization>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsBusinessInfoSchemaCustomization]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsBusinessInfoSchemaCustomization);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
