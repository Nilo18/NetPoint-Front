import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardHeaderDropdown } from './admin-dashboard-header-dropdown';

describe('AdminDashboardHeaderDropdown', () => {
  let component: AdminDashboardHeaderDropdown;
  let fixture: ComponentFixture<AdminDashboardHeaderDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardHeaderDropdown]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardHeaderDropdown);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
