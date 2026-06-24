import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardSearchBar } from './admin-dashboard-search-bar';

describe('AdminDashboardSearchBar', () => {
  let component: AdminDashboardSearchBar;
  let fixture: ComponentFixture<AdminDashboardSearchBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardSearchBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardSearchBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
