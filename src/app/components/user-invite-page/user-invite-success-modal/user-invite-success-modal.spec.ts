import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { UserInviteSuccessModal } from './user-invite-success-modal';

describe('UserInviteSuccessModal', () => {
  let component: UserInviteSuccessModal;
  let fixture: ComponentFixture<UserInviteSuccessModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserInviteSuccessModal],
      providers: [
        {
          provide: NgbActiveModal,
          useValue: {
            close: vi.fn(),
            dismiss: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserInviteSuccessModal);
    component = fixture.componentInstance;
  });

  it('should display the supplied success message', () => {
    component.message = 'Registered successfully! Wait until the owner accepts your request.';
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(component.message);
  });
});
