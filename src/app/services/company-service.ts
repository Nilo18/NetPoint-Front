import { inject, Injectable } from '@angular/core';
import { BackendUrlHolderService } from './backend-url-holder-service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface CompanyDTO {
  id: number,
  name: string,
  email: string,
  logo?: string
  industry: string
}

export interface CompanyUserDTO {
  id: number
  name: string
  email: string
  role: string
  profileImage?: string
}

export interface CompanyUserPayloadDTO {
  company: CompanyDTO
  user: CompanyUserDTO
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

  async getCompanyUserPayload() {
    try {
      const res = await firstValueFrom(
        this.http.get<CompanyUserPayloadDTO>(`${this.baseUrl}/api/company/company-user-payload`),
      )
      console.log(res)
      return res
    } catch (error) {
      console.log("Couldn't get company-user payload: ", error)
      throw error
    }
  }
}
