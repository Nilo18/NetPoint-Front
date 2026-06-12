import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BackendUrlHolderService } from './backend-url-holder-service';

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
  customAttributes: Record<string, string>
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private urlHolderService = inject(BackendUrlHolderService);
  private http = inject(HttpClient);
  private baseUrl = this.urlHolderService.getBaseUrl();

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

  async getAllProducts() {
    try {
      const res = await firstValueFrom(this.http.get(`${this.baseUrl}/api/products`));
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
}
