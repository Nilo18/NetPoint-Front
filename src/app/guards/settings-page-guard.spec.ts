import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { settingsPageGuard } from './settings-page-guard';

describe('settingsPageGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => settingsPageGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
