import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInviteErrorHandler } from './admin-invite-error-handler';

describe('AdminInviteErrorHandler', () => {
  let component: AdminInviteErrorHandler;
  let fixture: ComponentFixture<AdminInviteErrorHandler>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminInviteErrorHandler]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminInviteErrorHandler);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
