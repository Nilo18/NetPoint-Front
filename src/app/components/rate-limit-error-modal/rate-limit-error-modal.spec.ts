import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateLimitErrorModal } from './rate-limit-error-modal';

describe('RateLimitErrorModal', () => {
  let component: RateLimitErrorModal;
  let fixture: ComponentFixture<RateLimitErrorModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RateLimitErrorModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RateLimitErrorModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
