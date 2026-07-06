import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { ProductPageResponse, ProductService } from '../../../services/product-service';
import { BackendErrorHandlerService } from '../../../services/backend-error-handler-service';

@Component({
  selector: 'app-product-pagination',
  imports: [],
  templateUrl: './product-pagination.html',
  styleUrl: './product-pagination.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPagination {
  private productService = inject(ProductService)
  private backendErrorHandler = inject(BackendErrorHandlerService)
  // usersLoaded = output<User[]>()
  // backendError = output<string>()
  currentPage = signal(1)
  totalPages = signal<number>(1)
  requestSent = signal<boolean>(false)
  pageIsLoading = signal<boolean>(false)
  productPaginated = output<ProductPageResponse>()
  loadingChanged = output<boolean>()
  backendError = output<string>()
  newTotalPageAmount = input<number | undefined>(undefined)
  newCurrentPage = input<number | undefined>(undefined)
  basePageSize = input<number>(10)

  constructor() {
    effect(() => {
      const totalPageAmount = this.newTotalPageAmount()
      const currentPage = this.newCurrentPage()

      if (totalPageAmount && totalPageAmount !== this.totalPages()) {
        this.totalPages.set(totalPageAmount)
      }

      if (currentPage !== undefined && currentPage + 1 !== this.currentPage()) {
        this.currentPage.set(currentPage + 1)
      }
    })
  }

  // async ngOnInit() {
  //   if (!this.pageIsLoading()) {
  //     const res = await this.loadPage(1)
  //     console.log("LOADED PAGE: ", res)
  //   }
  // }

  get pageArray(): number[] {
    return this.totalPages() <= 10 ?
      Array.from({ length: this.totalPages() }, (_, i) => i + 1) 
      : Array.from({ length: 10 }, (_, i) => i + 1)
  }

  get trimemdPageArray() {
    return this.pageArray.slice(0, 9)
  }

  async onPageClick(page: number) {
    console.log('CHANGING TO PAGE: ', page)
    if (this.pageIsLoading() || this.requestSent()) {
      return
    }

    if (this.currentPage() === page || this.totalPages() === 1) {
      console.log('Already on the selected page.')
      return
    }

    if (page <= 0) {
      await this.loadPage(this.totalPages())
      return
    }

    if (page > this.totalPages()) {
      console.log('The suggested page exceeds the total amount of pages.')
      await this.loadPage(1)
      return
    }

    await this.loadPage(page)
  }

  private async loadPage(page: number) {
    // this.settingsService.setIsLoading(true)
    console.log('clicked page:', page, typeof page)

    if (this.requestSent()) {
      console.log('Page request is currently being processed, returning.')
      return
    }

    this.requestSent.set(true)
    this.pageIsLoading.set(true)
    this.loadingChanged.emit(true)

    try {
      const res = await this.productService.paginateProducts(page, this.basePageSize())

      if (!res) {
        // this.settingsService.setIsLoading(false)
        return
      }

      this.currentPage.set(res.currentPage + 1)
      this.totalPages.set(res.totalPages)
      // console.log(this.totalPages())
      this.productPaginated.emit(res)
      // this.usersLoaded.emit(res.userList)
      console.log('currentPage after:', this.currentPage(), typeof this.currentPage())
    } catch (error: unknown) {
      this.backendError.emit(this.backendErrorHandler.getErrorMessage(error, 'We could not load this page. Please try again.'))
    } finally {
      this.requestSent.set(false)
      this.pageIsLoading.set(false)
      this.loadingChanged.emit(false)
    }
  }

}
