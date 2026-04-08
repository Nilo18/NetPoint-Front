import { TestBed } from '@angular/core/testing';

import { SignupStateManagementService } from './signup-state-management-service';

describe('SignupStateManagementService', () => {
  let service: SignupStateManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignupStateManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
