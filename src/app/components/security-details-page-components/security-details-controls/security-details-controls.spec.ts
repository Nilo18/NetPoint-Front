import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityDetailsControls } from './security-details-controls';

describe('SecurityDetailsControls', () => {
  let component: SecurityDetailsControls;
  let fixture: ComponentFixture<SecurityDetailsControls>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityDetailsControls]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityDetailsControls);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
