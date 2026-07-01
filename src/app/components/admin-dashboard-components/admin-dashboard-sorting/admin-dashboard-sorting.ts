import { Component, effect, inject, output, signal } from '@angular/core';
import { ProductPageResponse, ProductService } from '../../../services/product-service';
import { FormsModule } from '@angular/forms';

interface SortObject {
  sortBy: string,
  sortDirection: string
}

@Component({
  selector: 'app-admin-dashboard-sorting',
  imports: [FormsModule],
  templateUrl: './admin-dashboard-sorting.html',
  styleUrl: './admin-dashboard-sorting.scss',
})
export class AdminDashboardSorting {
  private productService = inject(ProductService)
  productsWereSorted = output<ProductPageResponse>()
  sortObj = signal<SortObject>({
    sortBy: 'stock',
    sortDirection: 'desc'
  })

  constructor() {
    effect(() => {
      const sortObj = this.sortObj()

      this.sort(sortObj)
    })
  }

  onSortByChange(event: Event) {
    const sortBy = (event.target as HTMLSelectElement).value

    this.sortObj.update((current) => ({
      ...current,
      sortBy
    }))
  }

  onSortDirectionChange(event: Event) {
    const sortDirection = (event.target as HTMLSelectElement).value

    this.sortObj.update((current) => ({
      ...current,
      sortDirection
    }))
  }

  async sort(sortObj: SortObject) {
    console.log(this.sortObj)
    if (sortObj.sortBy === '' || sortObj.sortDirection === '') {
      console.log('sortObj is incomplete')
      return
    }

    const res = await this.productService.sortProducts(sortObj.sortBy, sortObj.sortDirection)

    this.productsWereSorted.emit(res)
  }
}
