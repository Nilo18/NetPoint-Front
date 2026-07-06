import { ChangeDetectionStrategy, Component, effect, inject, output, signal, untracked } from '@angular/core';
import { ProductPageResponse, ProductService } from '../../../services/product-service';
import { FormsModule } from '@angular/forms';
import { BackendErrorHandlerService } from '../../../services/backend-error-handler-service';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardFiltering {
  private productService = inject(ProductService)
  private backendErrorHandler = inject(BackendErrorHandlerService)
  oldFilterObj = signal<FilterObject>({
    filterBy: 'stock',
    filterFrom: '',
    filterTo: ''
  })
  filterObj = signal<FilterObject>({
    filterBy: 'stock',
    filterFrom: '',
    filterTo: ''
  })
  productsWereFiltered = output<ProductPageResponse>()
  loadingChanged = output<boolean>()
  backendError = output<string>()
  isLoading = signal(false)

  onFilterByChange(event: Event) {
    const filterBy = (event.target as HTMLSelectElement).value

    this.filterObj.update((current) => ({
      ...current,
      filterBy
    }))
    console.log(this.filterObj())
  }

  onFilterFromChange(event: Event) {
    const filterFrom = (event.target as HTMLInputElement).value

    this.filterObj.update((current) => ({
      ...current,
      filterFrom
    }))
    console.log(this.filterObj())
  }

  onFilterToChange(event: Event) {
    const filterTo = (event.target as HTMLInputElement).value

    this.filterObj.update((current) => ({
      ...current,
      filterTo
    }))
    console.log(this.filterObj())
  }

  constructor() {
    effect(() => {
      const filterObj = this.filterObj()
      const oldFilterObj = untracked(this.oldFilterObj)
      const onlyFilterFromChanged = 
        filterObj.filterFrom !== '' && filterObj.filterTo === ''
      const onlyFilterToChanged =
        filterObj.filterTo !== '' && filterObj.filterFrom === ''

      if (onlyFilterFromChanged || onlyFilterToChanged) {
        console.log('Only one part of the range has changed, avoiding request')
        return
      }

      const onlyFilterByChanged = 
        filterObj.filterBy !== oldFilterObj.filterBy &&
        !filterObj.filterFrom &&
        !filterObj.filterTo;

      const stockFilterIsIncomplete =
        filterObj.filterBy === 'stock' &&
        !filterObj.filterTo;

      const fromAndToHadValuesAndWereReset = 
        oldFilterObj.filterFrom !== '' && 
        oldFilterObj.filterTo !== '' &&
        filterObj.filterFrom === '' &&
        filterObj.filterTo === ''

      if ((onlyFilterByChanged || stockFilterIsIncomplete) && !fromAndToHadValuesAndWereReset) {
        console.log('Filter is incomplete, avoiding request.');
        return;
      }

      this.oldFilterObj.set({ ...filterObj });

      this.filter(filterObj)
    })
  }

  async filter(filterObj: FilterObject) {
    console.log("Sending: ", this.filterObj)
    if (filterObj.filterBy === '') {
      console.log('Filter attributes are incomplete.')
      return
    }

    this.isLoading.set(true)
    this.loadingChanged.emit(true)

    try {
      const res = await this.productService.filterProducts(
        filterObj.filterBy,
        filterObj.filterFrom,
        filterObj.filterTo
      )
      
      if (!res) {
        console.log('Filter failed.')
        return
      }

      this.productsWereFiltered.emit(res)
    } catch (error: unknown) {
      this.backendError.emit(this.backendErrorHandler.getErrorMessage(error, 'We could not filter products. Please try again.'))
    } finally {
      this.isLoading.set(false)
      this.loadingChanged.emit(false)
    }
  }

}
