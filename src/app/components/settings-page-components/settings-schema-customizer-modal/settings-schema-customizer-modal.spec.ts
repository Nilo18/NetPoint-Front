import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { SettingsSchemaCustomizerModal } from './settings-schema-customizer-modal';

describe('SettingsSchemaCustomizerModal', () => {
  let component: SettingsSchemaCustomizerModal;
  let fixture: ComponentFixture<SettingsSchemaCustomizerModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsSchemaCustomizerModal],
      providers: [NgbActiveModal],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsSchemaCustomizerModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
