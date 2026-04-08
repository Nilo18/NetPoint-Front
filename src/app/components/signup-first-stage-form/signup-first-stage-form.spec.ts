import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupFirstStageForm } from './signup-first-stage-form';

describe('SignupFirstStageForm', () => {
  let component: SignupFirstStageForm;
  let fixture: ComponentFixture<SignupFirstStageForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupFirstStageForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupFirstStageForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
