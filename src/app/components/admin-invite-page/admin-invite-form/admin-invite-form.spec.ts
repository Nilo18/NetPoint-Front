import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInviteForm } from './admin-invite-form';

describe('AdminInviteForm', () => {
  let component: AdminInviteForm;
  let fixture: ComponentFixture<AdminInviteForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminInviteForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminInviteForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
