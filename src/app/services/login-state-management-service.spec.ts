import { TestBed } from '@angular/core/testing';

import { LoginStateManagementService } from './login-state-management-service';

describe('LoginStateManagementService', () => {
  let service: LoginStateManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginStateManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
