import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditLogStats } from './audit-log-stats';

describe('AuditLogStats', () => {
  let component: AuditLogStats;
  let fixture: ComponentFixture<AuditLogStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditLogStats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditLogStats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
