import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackendErrorOverlay } from './backend-error-overlay';

describe('BackendErrorOverlay', () => {
  let component: BackendErrorOverlay;
  let fixture: ComponentFixture<BackendErrorOverlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackendErrorOverlay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackendErrorOverlay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
