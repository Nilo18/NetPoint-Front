import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
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

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private urlHolderService = inject(BackendUrlHolderService);
  private http = inject(HttpClient);
  private baseUrl = this.urlHolderService.getBaseUrl();
  private query: ProductQuery = {
    page: 0,
    size: 10,
    search: '',
    sortBy: '',
    sortDirection: '',
    filterBy: '',
    filterFrom: '',
    filterTo: ''
  };

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
    this.query = {
      ...this.query,
      search: search
    }

    return this.getAllProducts()
  }

  filterProducts(filterBy: string, filterFrom: string | number | null, filterTo: string | number | null) {
    const from = this.normalizeFilterValue(filterFrom);
    const to = this.normalizeFilterValue(filterTo);

    const hasRange = from !== '' && to !== '';

    this.query = hasRange
      ? {
          ...this.query,
          filterBy,
          filterFrom: from,
          filterTo: to,
          page: 0,
        }
      : {
          ...this.query,
          filterBy: '',
          filterFrom: '',
          filterTo: '',
          page: 0,
        };

    return this.getAllProducts();
  }

  private normalizeFilterValue(value: string | number | null): string {
    if (value === null) {
      return '';
    }

    return String(value).trim();
  }

  modifyQueryForSorting(sortBy: string, sortDirection: string) {
    this.query = {
      ...this.query,
      sortBy: sortBy,
      sortDirection: sortDirection,
      page: 0
    }
  }

  sortProducts(sortBy: string, sortDirection: string) {
    this.modifyQueryForSorting(sortBy, sortDirection)
    return this.getAllProducts()
  }

  modifyQueryForPagination(page: number, size: number) {
    this.query = {
      ...this.query,
      page: page - 1,
      size: size
    }
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

    return params;
  }

  async getAllProducts() {
    try {
      const res = await firstValueFrom(this.http.get<ProductPageResponse>(`${this.baseUrl}/api/products`, {
        params: this.buildParams(this.query)
      }));
      console.log(res);
      return res;
    } catch (error) {
      console.log("Couldn't get products: ", error);
      throw error;
    }
  }

  async addProduct(product: ProductAdditionCredentials) {
    try {
      const res = await firstValueFrom(this.http.post(`${this.baseUrl}/api/products`, product))
      console.log(res)
      return res
    } catch (error) {
      console.log("Couldn't add product: ", error);
      throw error;      
    }  
  }

  async editProduct(productId: number, product: ProductAdditionCredentials) {
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
