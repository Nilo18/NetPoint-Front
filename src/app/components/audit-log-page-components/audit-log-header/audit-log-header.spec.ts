import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditLogHeader } from './audit-log-header';

describe('AuditLogHeader', () => {
  let component: AuditLogHeader;
  let fixture: ComponentFixture<AuditLogHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditLogHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditLogHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
