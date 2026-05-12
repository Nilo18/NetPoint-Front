import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLoginSecondStageForm } from './admin-login-second-stage-form';

describe('AdminLoginSecondStageForm', () => {
  let component: AdminLoginSecondStageForm;
  let fixture: ComponentFixture<AdminLoginSecondStageForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLoginSecondStageForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLoginSecondStageForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
