import { inject, Injectable } from '@angular/core';
import { BackendUrlHolderService } from './backend-url-holder-service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface CheckoutRequestItem {
  productId: number
  quantity: number
}

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private urlHolderService = inject(BackendUrlHolderService);
  private http = inject(HttpClient);
  private baseUrl = this.urlHolderService.getBaseUrl();

  async checkout(items: CheckoutRequestItem[]) {
    try {
      const res = await firstValueFrom(
        this.http.post(`${this.baseUrl}/api/checkout`, {items}),
      );
      console.log(res);
      return res;
    } catch (error) {
      console.log("Couldn't checkout: ", error);
      throw error;
    }
  }
}
