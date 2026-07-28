import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityDetailsAccess } from './security-details-access';

describe('SecurityDetailsAccess', () => {
  let component: SecurityDetailsAccess;
  let fixture: ComponentFixture<SecurityDetailsAccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityDetailsAccess]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityDetailsAccess);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
