import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardRevenueChart } from './admin-dashboard-revenue-chart';

describe('AdminDashboardRevenueChart', () => {
  let component: AdminDashboardRevenueChart;
  let fixture: ComponentFixture<AdminDashboardRevenueChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardRevenueChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardRevenueChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
