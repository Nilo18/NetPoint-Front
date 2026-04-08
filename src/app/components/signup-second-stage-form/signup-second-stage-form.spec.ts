import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupSecondStageForm } from './signup-second-stage-form';

describe('SignupSecondStageForm', () => {
  let component: SignupSecondStageForm;
  let fixture: ComponentFixture<SignupSecondStageForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupSecondStageForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupSecondStageForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
