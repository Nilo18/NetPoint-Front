import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInfoUpdateValidatorModal } from './user-info-update-validator-modal';

describe('UserInfoUpdateValidatorModal', () => {
  let component: UserInfoUpdateValidatorModal;
  let fixture: ComponentFixture<UserInfoUpdateValidatorModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserInfoUpdateValidatorModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserInfoUpdateValidatorModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
