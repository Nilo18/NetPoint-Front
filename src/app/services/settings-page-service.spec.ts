import { TestBed } from '@angular/core/testing';

import { SettingsPageService } from './settings-page-service';

describe('SettingsPageService', () => {
  let service: SettingsPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingsPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
