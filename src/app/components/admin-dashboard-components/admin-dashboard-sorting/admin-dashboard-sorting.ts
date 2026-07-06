import { ChangeDetectionStrategy, Component, effect, inject, output, signal } from '@angular/core';
import { ProductPageResponse, ProductService } from '../../../services/product-service';
import { FormsModule } from '@angular/forms';
import { BackendErrorHandlerService } from '../../../services/backend-error-handler-service';

interface SortObject {
  sortBy: string,
  sortDirection: string
}

@Component({
  selector: 'app-admin-dashboard-sorting',
  imports: [FormsModule],
  templateUrl: './admin-dashboard-sorting.html',
  styleUrl: './admin-dashboard-sorting.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardSorting {
  private productService = inject(ProductService)
  private backendErrorHandler = inject(BackendErrorHandlerService)
  productsWereSorted = output<ProductPageResponse>()
  loadingChanged = output<boolean>()
  backendError = output<string>()
  isLoading = signal(false)
  private hasSkippedInitialSort = false
  sortObj = signal<SortObject>({
    sortBy: 'stock',
    sortDirection: 'desc'
  })

  // constructor() {
  //   effect(() => {
  //     const sortObj = this.sortObj()

  //     /** This was added to omit the getAllProducts() call, because admin-dashboard-inventory-management already does it */
  //     if (!this.hasSkippedInitialSort) {
  //       this.hasSkippedInitialSort = true
  //       return
  //     }

  //     this.sort(sortObj)
  //   })
  // }

  onSortByChange(event: Event) {
    const sortBy = (event.target as HTMLSelectElement).value

    const next = {
      ...this.sortObj(),
      sortBy
    }

    this.sortObj.set(next)
    this.sort(next)
  }

  onSortDirectionChange(event: Event) {
    const sortDirection = (event.target as HTMLSelectElement).value

    const next = {
      ...this.sortObj(),
      sortDirection
    }

    this.sortObj.set(next)
    this.sort(next)
  }

  async sort(sortObj: SortObject) {
    console.log(this.sortObj)
    if (sortObj.sortBy === '' || sortObj.sortDirection === '') {
      console.log('sortObj is incomplete')
      return
    }

    this.isLoading.set(true)
    this.loadingChanged.emit(true)

    try {
      const res = await this.productService.sortProducts(sortObj.sortBy, sortObj.sortDirection)

      this.productsWereSorted.emit(res)
    } catch (error: unknown) {
      this.backendError.emit(this.backendErrorHandler.getErrorMessage(error, 'We could not sort products. Please try again.'))
    } finally {
      this.isLoading.set(false)
      this.loadingChanged.emit(false)
    }
  }

}
