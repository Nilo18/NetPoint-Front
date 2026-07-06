import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';

import { BackendErrorHandlerService } from './backend-error-handler-service';

describe('BackendErrorHandlerService', () => {
  let service: BackendErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a backend string error from an HttpErrorResponse', () => {
    const error = new HttpErrorResponse({ error: 'Backend failed' });

    expect(service.getErrorMessage(error, 'Fallback')).toBe('Backend failed');
  });

  it('should return nested backend error messages', () => {
    const error = new HttpErrorResponse({ error: { error: { error: 'Nested failed' } } });

    expect(service.getErrorMessage(error, 'Fallback')).toBe('Nested failed');
  });

  it('should prefer message and title fields from backend objects', () => {
    expect(service.getErrorMessage({ message: 'Message failed' }, 'Fallback')).toBe('Message failed');
    expect(service.getErrorMessage({ title: 'Title failed' }, 'Fallback')).toBe('Title failed');
  });

  it('should return null for nullable messages when there is no error', () => {
    expect(service.getNullableErrorMessage(undefined, 'Fallback')).toBeNull();
  });
});
