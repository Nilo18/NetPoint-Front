import { TestBed } from '@angular/core/testing';

import { AdminInviteStateManagementService } from './admin-invite-state-management-service';

describe('AdminInviteStateManagementService', () => {
  let service: AdminInviteStateManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminInviteStateManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
