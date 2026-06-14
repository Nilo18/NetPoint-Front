import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, output, resource, signal } from '@angular/core';
import { ProductDTO, ProductService } from '../../../services/product-service';

@Component({
  selector: 'app-expense-calculator-product-list',
  imports: [],
  templateUrl: './expense-calculator-product-list.html',
  styleUrl: './expense-calculator-product-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseCalculatorProductList {
  private productService = inject(ProductService)
  productItems = signal<ProductDTO[]>([]);
  products = resource<ProductDTO[], unknown>({
    loader: async () => {
      const products = await this.productService.getAllProducts();
      this.productItems.set(products);
      return products;
    }
  })
  productLoadError = computed(() => this.getBackendErrorMessage(this.products.error()))
  productToAdd = output<ProductDTO>()
  readonly loadingCards = [1, 2, 3, 4, 5, 6, 7, 8];

  addProductToCart(product: ProductDTO) {
    if (!this.decreaseProductStock(product.id)) {
      return;
    }

    this.productToAdd.emit({
      ...product,
      stock: Math.max(product.stock - 1, 0)
    })
  }

  increaseProductStock(productId: number, amount = 1) {
    this.updateProductStock(productId, amount);
  }

  decreaseProductStock(productId: number) {
    const product = this.productItems().find(prod => prod.id === productId)

    if (!product || product.stock === 0) {
      console.log("Product is out of stock")
      return false
    }

    this.updateProductStock(productId, -1);
    return true
  }

  private updateProductStock(productId: number, amount: number) {
    this.productItems.update(products =>
      products.map(product =>
        product.id === productId
          ? { ...product, stock: Math.max(product.stock + amount, 0) }
          : product
      )
    );
  }

  private getBackendErrorMessage(error: unknown) {
    if (!error) {
      return '';
    }

    if (error instanceof HttpErrorResponse) {
      const backendMessage = this.extractBackendMessage(error.error);

      return backendMessage || error.message || 'Products could not be loaded. Please try again.';
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'Products could not be loaded. Please try again.';
  }

  private extractBackendMessage(errorBody: unknown): string | null {
    if (typeof errorBody === 'string') {
      return errorBody;
    }

    if (!errorBody || typeof errorBody !== 'object') {
      return null;
    }

    if ('message' in errorBody && typeof errorBody.message === 'string') {
      return errorBody.message;
    }

    if ('error' in errorBody && typeof errorBody.error === 'string') {
      return errorBody.error;
    }

    if ('title' in errorBody && typeof errorBody.title === 'string') {
      return errorBody.title;
    }

    return null;
  }
}
