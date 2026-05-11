import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDeletionErrorDisplayModal } from './user-deletion-error-display-modal';

describe('UserDeletionErrorDisplayModal', () => {
  let component: UserDeletionErrorDisplayModal;
  let fixture: ComponentFixture<UserDeletionErrorDisplayModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDeletionErrorDisplayModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDeletionErrorDisplayModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
