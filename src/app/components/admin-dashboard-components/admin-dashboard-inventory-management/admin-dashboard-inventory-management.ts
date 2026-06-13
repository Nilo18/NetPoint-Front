import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, resource, signal } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminDashboardAddProductModal } from '../admin-dashboard-add-product-modal/admin-dashboard-add-product-modal';
import { ProductDTO, ProductService } from '../../../services/product-service';
import { DeleteRequestErrorDisplayModal } from '../../delete-request-error-display-modal/delete-request-error-display-modal';

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
  imports: [],
  templateUrl: './admin-dashboard-inventory-management.html',
  styleUrl: './admin-dashboard-inventory-management.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardInventoryManagement {
  products = resource<ProductDTO[], unknown>({
    loader: () => this.productService.getAllProducts()
  })
  protected readonly deletingProductId = signal<number | null>(null);
  private modalService: NgbModal = inject(NgbModal);
  private productService: ProductService = inject(ProductService)

  ngOnInit() {
    console.log(this.products.value())
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

      this.products.update((products) => products?.filter(product => product.id !== productId));
    } catch (error) {
      const modalRef = this.modalService.open(DeleteRequestErrorDisplayModal, {
        centered: true
      })

      modalRef.componentInstance.errTitle = "Something Went Wrong During Product Deletion"
      modalRef.componentInstance.errMsg = this.getErrorMessage(
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

  private getErrorMessage(error: unknown, fallbackMessage: string) {
    if (error instanceof HttpErrorResponse) {
      const backendMessage = this.extractBackendMessage(error.error);

      return backendMessage || error.message || fallbackMessage;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return fallbackMessage;
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
