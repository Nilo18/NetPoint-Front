import { TestBed } from '@angular/core/testing';

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
});
