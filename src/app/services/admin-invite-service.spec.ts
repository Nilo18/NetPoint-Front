import { TestBed } from '@angular/core/testing';

import { AdminInviteService } from './admin-invite-service';

describe('AdminInviteService', () => {
  let service: AdminInviteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminInviteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
