import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { ProductPageResponse, ProductService } from '../../../services/product-service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, finalize, from, map, switchMap, tap } from 'rxjs';
import { BackendErrorHandlerService } from '../../../services/backend-error-handler-service';

@Component({
  selector: 'app-admin-dashboard-search-bar',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-dashboard-search-bar.html',
  styleUrl: './admin-dashboard-search-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardSearchBar {
  private productService = inject(ProductService)
  private backendErrorHandler = inject(BackendErrorHandlerService)
  readonly productWasSearched = output<ProductPageResponse>()
  readonly loadingChanged = output<boolean>()
  readonly backendError = output<string>()
  readonly queryControl = new FormControl('', { nonNullable: true })
  readonly isLoading = signal(false)

  constructor() {
    this.queryControl.valueChanges.pipe(
      map(query => query.trim()),
      debounceTime(250),
      distinctUntilChanged(),
      // filter(query => query.length > 0),
      switchMap(query => {
        this.setLoading(true)

        return from(this.productService.searchProducts(query)).pipe(
          catchError((error: unknown) => {
            this.backendError.emit(this.backendErrorHandler.getErrorMessage(error, 'We could not search products. Please try again.'))

            return EMPTY
          }),
          finalize(() => {
            this.setLoading(false)
          })
        )
      }),
      tap(response => this.productWasSearched.emit(response))
    ).subscribe()
  }

  private setLoading(isLoading: boolean) {
    this.isLoading.set(isLoading)
    this.loadingChanged.emit(isLoading)

    if (isLoading) {
      this.queryControl.disable({ emitEvent: false })
      return
    }

    this.queryControl.enable({ emitEvent: false })
  }

}
