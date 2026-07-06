import { ChangeDetectionStrategy, Component, inject, resource, signal } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminDashboardAddProductModal } from '../admin-dashboard-add-product-modal/admin-dashboard-add-product-modal';
import { ProductDTO, ProductPageResponse, ProductQuery, ProductService } from '../../../services/product-service';
import { DeleteRequestErrorDisplayModal } from '../../delete-request-error-display-modal/delete-request-error-display-modal';
import { ProductPagination } from '../../product-components/product-pagination/product-pagination';
import { AdminDashboardSearchBar } from '../admin-dashboard-search-bar/admin-dashboard-search-bar';
import { AdminDashboardSorting } from '../admin-dashboard-sorting/admin-dashboard-sorting';
import { AdminDashboardFiltering } from '../admin-dashboard-filtering/admin-dashboard-filtering';
import { BackendErrorHandlerService } from '../../../services/backend-error-handler-service';

type Profitability = 'High' | 'Medium';

interface InventoryProduct {
  readonly name: string;
  readonly stock: number;
  readonly wholesalePrice: string;
  readonly retailPrice: string;
  readonly margin: string;
  readonly profitability: Profitability;
}

@Component({
  selector: 'app-admin-dashboard-inventory-management',
  imports: [ProductPagination, AdminDashboardSearchBar, AdminDashboardSorting, AdminDashboardFiltering],
  templateUrl: './admin-dashboard-inventory-management.html',
  styleUrl: './admin-dashboard-inventory-management.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardInventoryManagement {
  private productService: ProductService = inject(ProductService)
  products = resource<ProductPageResponse, ProductQuery>({
    // params: () => this.productService.getQuery(),
    loader: () => {
      // this.productService.modifyQueryForPagination(1, 10)
      // this.productService.modifyQueryForSorting('stock', 'desc')
      return this.productService.getAllProducts()
    }
  })
  protected readonly tableIsLoading = signal(false);
  protected readonly backendError = signal<string | null>(null);
  protected readonly deletingProductId = signal<number | null>(null);
  private modalService: NgbModal = inject(NgbModal);
  private backendErrorHandler = inject(BackendErrorHandlerService);
  // pageAmountChanged = signal<boolean>(false)

  ngOnInit() {
    console.log(this.products.value())
  }

  handleProductsTransformation(newProducts: ProductPageResponse) {
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

  openProductAdditionModal() {
    return this.modalService.open(AdminDashboardAddProductModal, {
      centered: true
    })
  }

  editProduct(product: ProductDTO) {
    const modalRef = this.openProductAdditionModal()

    modalRef.componentInstance.productToEdit = product
  }

  getProfitabilityLabel(profit: number | null | undefined): 'Low' | 'Medium' | 'High' | 'N/A' {
    if (profit == null) return 'N/A';
    
    // Adjust these threshold numbers based on your actual business rules
    if (profit < 10) {
      return 'Low';
    } else if (profit >= 10 && profit < 50) {
      return 'Medium';
    } else {
      return 'High';
    }
  }

  getProfitabilityClassName(profit: number | null | undefined) {
    if (profit == null) return 'N/A';
    
    // Adjust these threshold numbers based on your actual business rules
    if (profit < 10) {
      return 'inventory-management__profitability';
    } else if (profit >= 10 && profit < 50) {
      return 'inventory-management__profitability';
    } else {
      return 'inventory-management__profitability--high';
    }
  }

  async deleteProduct(productId: number) {
    if (this.deletingProductId()) {
      return;
    }

    try {
      this.deletingProductId.set(productId);
      await this.productService.deleteProduct(productId)

      const currentProducts = this.products.value();
      if (currentProducts?.items) {
        currentProducts.items = currentProducts.items.filter(product => product.id !== productId);
      }
      // this.products.update((products) => products?.filter(product => product.id !== productId));
    } catch (error) {
      const modalRef = this.modalService.open(DeleteRequestErrorDisplayModal, {
        centered: true
      })

      modalRef.componentInstance.errTitle = "Something Went Wrong During Product Deletion"
      modalRef.componentInstance.errMsg = this.backendErrorHandler.getErrorMessage(
        error,
        'We could not remove this product. Please try again.',
      );
    } finally {
      this.deletingProductId.set(null);
    }
  }

  protected isDeletingProduct(productId: number) {
    return this.deletingProductId() === productId;
  }

}
