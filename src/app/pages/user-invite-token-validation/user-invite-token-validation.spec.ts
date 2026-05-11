import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInviteTokenValidation } from './user-invite-token-validation';

describe('UserInviteTokenValidation', () => {
  let component: UserInviteTokenValidation;
  let fixture: ComponentFixture<UserInviteTokenValidation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserInviteTokenValidation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserInviteTokenValidation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
