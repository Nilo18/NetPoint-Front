import { inject, Injectable } from '@angular/core';
import { BackendUrlHolderService } from './backend-url-holder-service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface CompanyDTO {
  id: number,
  name: string,
  email: string,
  industry: string
}

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private backendUrlHolder = inject(BackendUrlHolderService)
  private http = inject(HttpClient)
  baseUrl: string = this.backendUrlHolder.getBaseUrl()

  async getCompanyInfo() {
    try {
      const res = await firstValueFrom(this.http.get<CompanyDTO>(`${this.baseUrl}/api/company`))
      console.log(res)
      return res
    } catch (error) {
      console.log("Couldn't get company info: ", error)
      throw error
    }
  }
}
