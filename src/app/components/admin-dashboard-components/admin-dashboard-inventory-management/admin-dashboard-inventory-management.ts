import { ChangeDetectionStrategy, Component, inject, resource, signal } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminDashboardAddProductModal } from '../admin-dashboard-add-product-modal/admin-dashboard-add-product-modal';
import { ProductDTO, ProductService } from '../../../services/product-service';
import { KeyValuePipe } from '@angular/common';
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
  imports: [KeyValuePipe],
  templateUrl: './admin-dashboard-inventory-management.html',
  styleUrl: './admin-dashboard-inventory-management.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardInventoryManagement {
  products = resource<ProductDTO[], unknown>({
    loader: () => this.productService.getAllProducts()
  })
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
    try {
      const res = await this.productService.deleteProduct(productId)

      if (res) {
        this.products.reload()
      }
    } catch (error) {
      const modalRef = this.modalService.open(DeleteRequestErrorDisplayModal, {
        centered: true
      })

      modalRef.componentInstance.errTitle = "Something Went Wrong During Product Deletion"
      modalRef.componentInstance.error.error.error
    }
  }
}
