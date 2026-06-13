import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { FormValidatorService } from './form-validator-service';

describe('FormValidatorService', () => {
  let service: FormValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('returns required errors only after a control is touched', () => {
    const form = new FormGroup({
      name: new FormControl('', Validators.required),
    });

    expect(service.getRequiredError('name', form)).toBe('');

    form.get('name')?.markAsTouched();

    expect(service.getRequiredError('name', form)).toBe('Name is required.');
  });

  it('returns email errors separately from required errors', () => {
    const form = new FormGroup({
      email: new FormControl('not-an-email', [Validators.required, Validators.email]),
    });

    form.get('email')?.markAsTouched();

    expect(service.getEmailError('email', form)).toBe('Invalid email address.');
  });

  it('returns configured length errors', () => {
    const form = new FormGroup({
      password: new FormControl('short', Validators.minLength(8)),
      otpCode: new FormControl('1234567', Validators.maxLength(6)),
    });

    form.get('password')?.markAsTouched();
    form.get('otpCode')?.markAsTouched();

    expect(service.getMinLengthError('password', form)).toBe(
      'Password must be at least 8 characters long'
    );
    expect(service.getMaxLengthError('otpCode', form)).toBe(
      'OtpCode must be at most 6 characters long'
    );
  });

  it('returns the first available error from a checker list', () => {
    expect(service.getFirstError('', 'Second error', 'Third error')).toBe('Second error');
  });
});
