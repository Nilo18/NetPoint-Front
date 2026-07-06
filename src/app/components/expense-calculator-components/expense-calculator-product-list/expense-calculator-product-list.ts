import { ChangeDetectionStrategy, Component, computed, inject, output, resource, signal } from '@angular/core';
import { ProductDTO, ProductPageResponse, ProductService } from '../../../services/product-service';
import { AdminDashboardSearchBar } from '../../admin-dashboard-components/admin-dashboard-search-bar/admin-dashboard-search-bar';
import { AdminDashboardSorting } from '../../admin-dashboard-components/admin-dashboard-sorting/admin-dashboard-sorting';
import { AdminDashboardFiltering } from '../../admin-dashboard-components/admin-dashboard-filtering/admin-dashboard-filtering';
import { ProductPagination } from '../../product-components/product-pagination/product-pagination';
import { BackendErrorHandlerService } from '../../../services/backend-error-handler-service';

@Component({
  selector: 'app-expense-calculator-product-list',
  imports: [AdminDashboardSearchBar, AdminDashboardSorting, AdminDashboardFiltering, ProductPagination],
  templateUrl: './expense-calculator-product-list.html',
  styleUrl: './expense-calculator-product-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseCalculatorProductList {
  private productService = inject(ProductService)
  private backendErrorHandler = inject(BackendErrorHandlerService)
  // productItems = signal<ProductDTO[]>([]);
  protected readonly tableIsLoading = signal(false);
  protected readonly backendError = signal<string | null>(null);
  products = resource<ProductPageResponse, unknown>({
    loader:  () => {
      this.productService.modifyQueryForPagination(1, 8)
      this.productService.modifyQueryForSorting('stock', 'desc')
      return this.productService.getAllProducts();
      // this.productItems.set(products.items);
      // return products;
    }
  })
  productLoadError = computed(() => this.backendErrorHandler.getNullableErrorMessage(
    this.products.error(),
    'Products could not be loaded. Please try again.',
  ) ?? '')
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

  handleProductsTransformation(newProducts: ProductPageResponse) {
    // if (newProducts.totalPages !== this.products.value()?.totalPages) {
    //   this.pageAmountChanged.set(true)
    // }

    this.products.set(newProducts)
    this.backendError.set(null)
    this.tableIsLoading.set(false)
  }

  handleProductsLoading(isLoading: boolean) {
    this.tableIsLoading.set(isLoading)
    if (isLoading) {
      this.backendError.set(null)
    }
  }

  handleProductsBackendError(message: string) {
    this.backendError.set(message)
    this.tableIsLoading.set(false)
  }


  increaseProductStock(productId: number, amount = 1) {
    this.updateProductStock(productId, amount);
  }

  decreaseProductStock(productId: number) {
    const product = this.products.value()?.items.find(prod => prod.id === productId)

    if (!product || product.stock === 0) {
      console.log("Product is out of stock")
      return false
    }

    this.updateProductStock(productId, -1);
    return true
  }

  private updateProductStock(productId: number, amount: number) {
    const current = this.products.value()

    if (!current) {
      return
    }

    this.products.set({
      ...current,
      items: current.items.map(product =>
        product.id === productId
          ? { ...product, stock: Math.max(product.stock + amount, 0) }
          : product
      ),
    });
  }

}
