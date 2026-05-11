import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInviteForm } from './user-invite-form';

describe('UserInviteForm', () => {
  let component: UserInviteForm;
  let fixture: ComponentFixture<UserInviteForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserInviteForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserInviteForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
