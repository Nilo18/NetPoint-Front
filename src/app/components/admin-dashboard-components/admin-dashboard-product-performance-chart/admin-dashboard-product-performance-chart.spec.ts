import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardProductPerformanceChart } from './admin-dashboard-product-performance-chart';

describe('AdminDashboardProductPerformanceChart', () => {
  let component: AdminDashboardProductPerformanceChart;
  let fixture: ComponentFixture<AdminDashboardProductPerformanceChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardProductPerformanceChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardProductPerformanceChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
