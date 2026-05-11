import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInviteErrorHandler } from './user-invite-error-handler';

describe('UserInviteErrorHandler', () => {
  let component: UserInviteErrorHandler;
  let fixture: ComponentFixture<UserInviteErrorHandler>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserInviteErrorHandler]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserInviteErrorHandler);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
