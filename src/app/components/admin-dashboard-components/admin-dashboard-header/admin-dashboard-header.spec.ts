import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardHeader } from './admin-dashboard-header';

describe('AdminDashboardHeader', () => {
  let component: AdminDashboardHeader;
  let fixture: ComponentFixture<AdminDashboardHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
