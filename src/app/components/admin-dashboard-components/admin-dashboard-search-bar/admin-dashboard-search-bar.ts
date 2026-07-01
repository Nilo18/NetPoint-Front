import { Component, inject, output, signal } from '@angular/core';
import { ProductPageResponse, ProductService } from '../../../services/product-service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard-search-bar',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-dashboard-search-bar.html',
  styleUrl: './admin-dashboard-search-bar.scss',
})
export class AdminDashboardSearchBar {
  private productService = inject(ProductService)
  readonly productWasSearched = output<ProductPageResponse>()
  readonly queryControl = new FormControl('', { nonNullable: true })

  constructor() {
    this.queryControl.valueChanges.pipe(
      map(query => query.trim()),
      debounceTime(250),
      distinctUntilChanged(),
      // filter(query => query.length > 0),
      switchMap(query => this.productService.searchProducts(query)),
      tap(response => this.productWasSearched.emit(response))
    ).subscribe()
  }
}
