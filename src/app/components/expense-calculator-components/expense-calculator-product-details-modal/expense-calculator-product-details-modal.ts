import { ChangeDetectionStrategy, Component, computed, inject, resource, signal, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomAttributeValue, ProductDTO, ProductService } from '../../../services/product-service';

export interface ProductDetailsModalResult {
  product: ProductDTO;
  quantity: number;
}

@Component({
  selector: 'app-expense-calculator-product-details-modal',
  imports: [],
  templateUrl: './expense-calculator-product-details-modal.html',
  styleUrl: './expense-calculator-product-details-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ExpenseCalculatorProductDetailsModal {
  readonly modal = inject(NgbActiveModal)
  private productService = inject(ProductService)
  readonly productId = signal<number | undefined>(undefined)
  protected readonly quantity = signal(1)
  productData = resource<ProductDTO, number | undefined>({
    params: () => this.productId(),
    loader: ({ params }) => {
      if (params === undefined) {
        throw new Error('A product ID is required to load product details.')
      }

      return this.productService.getProductById(params)
    }
  })
  protected readonly customAttributes = computed(() =>
    Object.entries(this.productData.value()?.customAttributes ?? {})
  )

  protected decreaseQuantity() {
    this.quantity.update(quantity => Math.max(quantity - 1, 1))
  }

  protected increaseQuantity() {
    const stock = this.productData.value()?.stock ?? 0
    this.quantity.update(quantity => Math.min(quantity + 1, stock))
  }

  protected addToCart() {
    const product = this.productData.value()

    if (!product || product.stock === 0) {
      return
    }

    const result: ProductDetailsModalResult = {
      product,
      quantity: this.quantity(),
    }
    this.modal.close(result)
  }

  protected formatAttributeName(attributeName: string) {
    const normalizedName = attributeName
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/[_-]+/g, ' ')
      .toLowerCase()

    return normalizedName.replace(
      /^./,
      firstCharacter => firstCharacter.toUpperCase(),
    )
  }

  protected formatAttributeValue(value: CustomAttributeValue) {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No'
    }

    return value
  }
}
