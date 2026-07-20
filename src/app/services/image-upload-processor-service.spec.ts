import { TestBed } from '@angular/core/testing';

import { ImageUploadProcessorService } from './image-upload-processor-service';

describe('ImageUploadProcessorService', () => {
  let service: ImageUploadProcessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageUploadProcessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
