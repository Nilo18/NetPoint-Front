import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsBilling } from './settings-billing';

describe('SettingsBilling', () => {
  let component: SettingsBilling;
  let fixture: ComponentFixture<SettingsBilling>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsBilling]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsBilling);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
