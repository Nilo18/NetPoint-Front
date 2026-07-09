import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BackendUrlHolderService } from './backend-url-holder-service';

export type CustomAttributeValue = string | number | boolean

export enum AttributeType {
  String = 'string',
  Number = 'number',
  Date = 'Date',
  Boolean = 'boolean',
}

export interface ProductAttribute {
  id?: number;
  attributeName: string;
  attributeType: AttributeType;
  isDefault: boolean;
}

export interface ProductAdditionCredentials {
  stock: number,
  wholesalePrice: number,
  imageUrl?: string,
  name: string,
  retailPrice: number,
  customAttributes: Record<string, CustomAttributeValue>
}

export interface ProductDTO {
  id: number;
  name: string;
  retailPrice: number;
  customAttributes: Record<string, CustomAttributeValue>;
  stock: number;
  wholesalePrice: number;
  marginPercent: number;
  profitability: number;
  imageUrl?: string;
  quantity?: number
}

export interface ProductPageResponse {
  items: ProductDTO[],
  page: number,
  size: number,
  totalPages: number,
  currentPage: number
}

export interface ProductQuery {
  page: number;
  size: number;
  search: string;
  sortBy: string;
  sortDirection: string;
  filterBy: string;
  filterFrom: string;
  filterTo: string;
}

export interface ProductStatsQuery {
  search: string;
  filterBy: string;
  filterFrom: string;
  filterTo: string;
}

export interface ProductStats {
  totalRevenue: number,
  increaseFromLastMonth: number,
  netProfit: number,
  margin: number,
  topSellingItem: string,
  unitsSold: number,
  lowStockItemCount: number
}

export interface MonthlyFinancials {
  month: string,
  revenue: number
  profit: number
}

export interface TopProfitableItem {
  productName: string,
  productProfit: number
}

export interface ProductChartData {
  monthlyData: MonthlyFinancials[],
  topSixProducts: TopProfitableItem[]
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private urlHolderService = inject(BackendUrlHolderService);
  private http = inject(HttpClient);
  private baseUrl = this.urlHolderService.getBaseUrl();
  private query = signal<ProductQuery>({
    page: 0,
    size: 10,
    search: '',
    sortBy: 'stock',
    sortDirection: 'desc',
    filterBy: '',
    filterFrom: '',
    filterTo: ''
  });
  // private _productChartData = signal<ProductChartData>({
  //   monthlyData: [],
  //   topSixProducts: []
  // })

  // readonly productChartData = this._productChartData.asReadonly()


  getQuery() { return this.query }

  async addProductAttribute(productAttribute: ProductAttribute) {
    try {
      const res = await firstValueFrom(
        this.http.post(`${this.baseUrl}/api/products/attributes`, productAttribute),
      );
      console.log(res);
      return res;
    } catch (error) {
      console.log("Couldn't add product attribute: ", error);
      throw error;
    }
  }

  async getProductAttributes() {
    try {
      const res = await firstValueFrom(
        this.http.get<ProductAttribute[]>(`${this.baseUrl}/api/products/attributes`),
      );
      console.log(res);
      return res;
    } catch (error) {
      console.log("Couldn't get product attributes: ", error);
      throw error;
    }
  }

  async getArtificialProductAttributes() {
    try {
      const res = await firstValueFrom(this.http.get<ProductAttribute[]>
        (`${this.baseUrl}/api/products/artificial-attributes`))
      console.log(res)
      return res
    } catch (error) {
      console.log("Couldn't get artificial product attributes: ", error);
      throw error;      
    }
  }

  async deleteProductAttributes(id: number) {
    try {
      const res = await firstValueFrom(
        this.http.delete(`${this.baseUrl}/api/products/attributes/${id}`),
      );
      console.log(res);
      return res;
    } catch (error) {
      console.log("Couldn't delete product attributes: ", error);
      throw error;
    }
  }

  async updateProductAttribute(attribute: ProductAttribute) {
    try {
      const res = await firstValueFrom(
        this.http.put(`${this.baseUrl}/api/products/attributes`, attribute),
      );
      console.log(res);
      return res;
    } catch (error) {
      console.log("Couldn't update product attributes: ", error);
      throw error;
    }
  }

  searchProducts(search: string) {
    this.query.update(query => ({
      ...query,
      search: search
    }))

    return this.getAllProducts()
  }

  filterProducts(filterBy: string, filterFrom: string | number | null, filterTo: string | number | null) {
    const from = this.normalizeFilterValue(filterFrom);
    const to = this.normalizeFilterValue(filterTo);

    const hasRange = from !== '' && to !== '';

    this.query.update(query => hasRange
      ? {
          ...query,
          filterBy,
          filterFrom: from,
          filterTo: to,
          page: 0,
        }
      : {
          ...query,
          filterBy: '',
          filterFrom: '',
          filterTo: '',
          page: 0,
        });

    return this.getAllProducts();
  }

  private normalizeFilterValue(value: string | number | null): string {
    if (value === null) {
      return '';
    }

    return String(value).trim();
  }

  modifyQueryForSorting(sortBy: string, sortDirection: string) {
    this.query.update(query => ({
      ...query,
      sortBy: sortBy,
      sortDirection: sortDirection,
      page: 0
    }))
  }

  sortProducts(sortBy: string, sortDirection: string) {
    this.modifyQueryForSorting(sortBy, sortDirection)
    return this.getAllProducts()
  }

  modifyQueryForPagination(page: number, size: number) {
    this.query.update(query => ({
      ...query,
      page: page - 1,
      size: size
    }))
  }

  paginateProducts(page: number, size: number) {
    this.modifyQueryForPagination(page, size)
    return this.getAllProducts()
  }

  private buildParams(query: ProductQuery): Record<string, string | number> {
    const params: Record<string, string | number> = {
      page: query.page,
      size: query.size
    };

    if (query.search) {
      params['search'] = query.search;
    }

    if (query.sortBy) {
      params['sortBy'] = query.sortBy;
    }

    if (query.sortDirection) {
      params['sortDirection'] = query.sortDirection;
    }

    if (query.filterBy) {
      params['filterBy'] = query.filterBy;
    }

    if (query.filterFrom) {
      params['filterFrom'] = query.filterFrom;
    }

    if (query.filterTo) {
      params['filterTo'] = query.filterTo;
    }

    console.log(params)
    return params;
  }

  async getAllProducts() {
    try {
      const res = await firstValueFrom(this.http.get<ProductPageResponse>(`${this.baseUrl}/api/products`, {
        params: this.buildParams(this.query())
      }));
      console.log(res);
      return res;
    } catch (error) {
      console.log("Couldn't get products: ", error);
      throw error;
    }
  }

  async getProductStats(statsQuery: ProductStatsQuery) {
    try {
      let httpParams = new HttpParams()
      .set('search', statsQuery.search)
      .set('filterBy', statsQuery.filterBy)
      .set('filterFrom', statsQuery.filterFrom)
      .set('filterTo', statsQuery.filterTo);
      const res = await firstValueFrom(this.http.get<ProductStats>(`${this.baseUrl}/api/products/stats`, {
        params: httpParams
      }))
      console.log(res)
      return res
    } catch (error) {
      console.log("Couldn't get product stats: ", error)
      throw error
    }
  }

  async getProductCharts() {
    try {
      const res = await firstValueFrom(this.http.get<ProductChartData>(`${this.baseUrl}/api/products/charts`))
      console.log(res)
      // this._productChartData.set(res)
      return res
    } catch (error) {
      console.log("Couldn't get product chart data: ", error)
      throw error
    }
  }

  async addProduct(product: FormData) {
    try {
      const res = await firstValueFrom(this.http.post(`${this.baseUrl}/api/products`, product))
      console.log(res)
      return res
    } catch (error) {
      console.log("Couldn't add product: ", error);
      throw error;      
    }  
  }

  async editProduct(productId: number, product: FormData) {
    try {
      const res = await firstValueFrom(this.http.put(`${this.baseUrl}/api/products/${productId}`, product))
      console.log(res)
      return res
    } catch (error) {
      console.log("Couldn't edit product: ", error);
      throw error;      
    }  
  }

  async deleteProduct(productId: number) {
    try {
      const res = await firstValueFrom(this.http.delete(`${this.baseUrl}/api/products/${productId}`))
      console.log(res)
      return res
    } catch (error) {
      console.log("Couldn't delete product: ", error);
      throw error;      
    }
  }
}
