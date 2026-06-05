import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardStats } from './admin-dashboard-stats';

describe('AdminDashboardStats', () => {
  let component: AdminDashboardStats;
  let fixture: ComponentFixture<AdminDashboardStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardStats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardStats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
