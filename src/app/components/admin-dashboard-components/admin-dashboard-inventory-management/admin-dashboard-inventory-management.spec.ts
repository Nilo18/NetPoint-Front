import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardInventoryManagement } from './admin-dashboard-inventory-management';

describe('AdminDashboardInventoryManagement', () => {
  let component: AdminDashboardInventoryManagement;
  let fixture: ComponentFixture<AdminDashboardInventoryManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardInventoryManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardInventoryManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
