import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { basicGuard } from './basic-guard';

describe('basicGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => basicGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
