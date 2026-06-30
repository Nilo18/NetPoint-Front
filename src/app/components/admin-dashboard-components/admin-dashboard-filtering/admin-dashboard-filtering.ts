import { Component, inject, output } from '@angular/core';
import { ProductPageResponse, ProductService } from '../../../services/product-service';
import { FormsModule } from '@angular/forms';

interface FilterObject {
  filterBy: string,
  filterFrom: string | number | null,
  filterTo: string | number | null
}

@Component({
  selector: 'app-admin-dashboard-filtering',
  imports: [FormsModule],
  templateUrl: './admin-dashboard-filtering.html',
  styleUrl: './admin-dashboard-filtering.scss',
})
export class AdminDashboardFiltering {
  private productService = inject(ProductService)
  filterObj: FilterObject = {
    filterBy: 'stock',
    filterFrom: '',
    filterTo: ''
  }
  productsWereFiltered = output<ProductPageResponse>()

  async filter() {
    console.log("Sending: ", this.filterObj)
    if (this.filterObj.filterBy === '') {
      console.log('Filter attributes are incomplete.')
      return
    }

    const res = await this.productService.filterProducts(
      this.filterObj.filterBy,
      this.filterObj.filterFrom,
      this.filterObj.filterTo
    )
    
    if (!res) {
      console.log('Filter failed.')
      return
    }

    this.productsWereFiltered.emit(res)
  }
}
