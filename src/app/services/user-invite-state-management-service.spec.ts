import { TestBed } from '@angular/core/testing';

import { UserInviteStateManagementService } from './user-invite-state-management-service';

describe('UserInviteStateManagementService', () => {
  let service: UserInviteStateManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserInviteStateManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
