import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInviteTokenValidation } from './admin-invite-token-validation';

describe('AdminInviteTokenValidation', () => {
  let component: AdminInviteTokenValidation;
  let fixture: ComponentFixture<AdminInviteTokenValidation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminInviteTokenValidation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminInviteTokenValidation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
