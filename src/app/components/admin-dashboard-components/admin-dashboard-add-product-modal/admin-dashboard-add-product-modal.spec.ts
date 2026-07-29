import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AdminDashboardAddProductModal } from './admin-dashboard-add-product-modal';
import { ProductDTO, ProductService } from '../../../services/product-service';

describe('AdminDashboardAddProductModal', () => {
  let component: AdminDashboardAddProductModal;
  let fixture: ComponentFixture<AdminDashboardAddProductModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardAddProductModal],
      providers: [
        NgbActiveModal,
        {
          provide: ProductService,
          useValue: {
            getArtificialProductAttributes: () => Promise.resolve([]),
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardAddProductModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('preserves an existing image when only another product attribute changes', () => {
    const product = createProduct();
    component.productToEdit = product;
    component.imagePreview.set(product.imageUrl ?? null);
    component.productForm.patchValue({ name: 'Updated product' });

    const payload = getFormattedPayload(component);

    expect(payload.has('removeImage')).toBe(false);
    expect(payload.has('image')).toBe(false);
  });

  it('requests image removal only after the existing image is removed', () => {
    component.productToEdit = createProduct();
    component.imagePreview.set(null);

    const payload = getFormattedPayload(component);

    expect(payload.get('removeImage')).toBe('true');
    expect(payload.has('image')).toBe(false);
  });
});

function createProduct(): ProductDTO {
  return {
    id: 1,
    name: 'Product',
    retailPrice: 20,
    wholesalePrice: 10,
    stock: 5,
    marginPercent: 50,
    profitability: 10,
    imageUrl: 'https://example.com/product.webp',
    customAttributes: {},
  };
}

function getFormattedPayload(component: AdminDashboardAddProductModal): FormData {
  return (
    component as unknown as { formatPayload(): FormData }
  ).formatPayload();
}
