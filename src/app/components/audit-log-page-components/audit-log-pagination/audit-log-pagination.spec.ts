import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditLogPagination } from './audit-log-pagination';

describe('AuditLogPagination', () => {
  let component: AuditLogPagination;
  let fixture: ComponentFixture<AuditLogPagination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditLogPagination]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditLogPagination);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
