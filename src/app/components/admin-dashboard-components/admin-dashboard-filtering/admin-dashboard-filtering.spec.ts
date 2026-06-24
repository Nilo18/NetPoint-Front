import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardFiltering } from './admin-dashboard-filtering';

describe('AdminDashboardFiltering', () => {
  let component: AdminDashboardFiltering;
  let fixture: ComponentFixture<AdminDashboardFiltering>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardFiltering]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardFiltering);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
