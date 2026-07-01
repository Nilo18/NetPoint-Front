import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ProductService } from '../../../services/product-service';

@Component({
  selector: 'app-product-pagination',
  imports: [],
  templateUrl: './product-pagination.html',
  styleUrl: './product-pagination.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPagination {
  private productService = inject(ProductService)
  // usersLoaded = output<User[]>()
  // backendError = output<string>()
  currentPage = signal(1)
  totalPages = signal(1)
  basePageSize: number = 10

  get pageArray(): number[] {
    return this.totalPages() <= 10 ?
      Array.from({ length: this.totalPages() }, (_, i) => i + 1) 
      : Array.from({ length: 10 }, (_, i) => i + 1)
  }

  get trimemdPageArray() {
    return this.pageArray.slice(0, 9)
  }

    async onPageClick(page: number) {
    if (this.currentPage() === page || this.totalPages() === 1) {
      console.log('Already on the selected page.')
      return
    }

    if (page <= 0) {
      await this.loadPage(this.totalPages(), this.basePageSize)
      return
    }

    if (page > this.totalPages()) {
      console.log('The suggested page exceeds the total amount of pages.')
      await this.loadPage(1, this.basePageSize)
      return
    }

    await this.loadPage(page, this.basePageSize)
  }

  private async loadPage(page: number, size: number) {
    // this.settingsService.setIsLoading(true)
    console.log('clicked page:', page, typeof page)

    try {
      const res = await this.productService.paginateProducts(page, this.basePageSize)

      if (!res) {
        // this.settingsService.setIsLoading(false)
        return
      }

      this.currentPage.set(res.currentPage + 1)
      this.totalPages.set(res.totalPages)
      // this.usersLoaded.emit(res.userList)
      console.log('currentPage after:', this.currentPage(), typeof this.currentPage())
    } catch (error: any) {
      // this.backendError.emit(error.error.error)
    }
  }
}
