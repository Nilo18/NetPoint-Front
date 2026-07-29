import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ExpenseCalculatorProductDetailsModal } from './expense-calculator-product-details-modal';
import { ProductDTO, ProductService } from '../../../services/product-service';

describe('ExpenseCalculatorProductDetailsModal', () => {
  let component: ExpenseCalculatorProductDetailsModal;
  let fixture: ComponentFixture<ExpenseCalculatorProductDetailsModal>;
  const product: ProductDTO = {
    id: 1,
    name: 'Ethiopian Dark Roast',
    retailPrice: 18.99,
    wholesalePrice: 11.5,
    stock: 42,
    marginPercent: 39.4,
    profitability: 7.49,
    imageUrl: 'https://example.com/coffee.webp',
    customAttributes: {
      roastLevel: 'Dark',
      organic: true,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseCalculatorProductDetailsModal],
      providers: [
        NgbActiveModal,
        {
          provide: ProductService,
          useValue: {
            getProductById: () => Promise.resolve(product),
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseCalculatorProductDetailsModal);
    component = fixture.componentInstance;
    component.productId.set(product.id);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders standard and custom product details', () => {
    const content = fixture.nativeElement.textContent as string;

    expect(content).toContain('Ethiopian Dark Roast');
    expect(content).toContain('$18.99');
    expect(content).toContain('Roast level');
    expect(content).toContain('Dark');
    expect(content).toContain('Organic');
    expect(content).toContain('Yes');
  });
});
