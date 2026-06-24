import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardSorting } from './admin-dashboard-sorting';

describe('AdminDashboardSorting', () => {
  let component: AdminDashboardSorting;
  let fixture: ComponentFixture<AdminDashboardSorting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardSorting]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardSorting);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
