import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AdminDashboardAddProductModal } from './admin-dashboard-add-product-modal';

describe('AdminDashboardAddProductModal', () => {
  let component: AdminDashboardAddProductModal;
  let fixture: ComponentFixture<AdminDashboardAddProductModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardAddProductModal],
      providers: [NgbActiveModal],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardAddProductModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
