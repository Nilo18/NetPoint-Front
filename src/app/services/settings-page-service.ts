import { inject, Injectable, signal } from '@angular/core';
import { BackendUrlHolderService } from './backend-url-holder-service';
import { HttpClient } from '@angular/common/http';
import { first, firstValueFrom } from 'rxjs';

export interface User {
  id: number,
  name: string,
  email: string,
  role: string
}

export interface GetUserListResponse {
  userList: User[],
  page: number,
  size: number,
  totalPages: number,
  currentPage: number
}

export interface AdminInviteCredentials {
  email: string,
  role: string,
  companyId: number
}

export interface CashierCredentials {
  name: string,
  email: string,
  role: string,
  pin: string,
  companyId: number
}

export interface CompanyDTO {
  id: number,
  name: string,
  email: string,
  industry: string
}

export interface CredentialsUpdateRequestResponse {
  status: number,
  tempToken: string
}

export interface VerificationCredentials {
  tempToken: string
  verificationCode: string
}

export enum AttributeType {
  String = 'string',
  Number = 'number',
  Date = 'Date',
  Boolean = 'boolean'
}

export interface ProductAttribute {
  id?: number
  attributeName: string,
  attributeType: AttributeType
}

@Injectable({
  providedIn: 'root',
})
export class SettingsPageService {
  private urlHolderService = inject(BackendUrlHolderService)
  private http = inject(HttpClient)
  private baseUrl = this.urlHolderService.getBaseUrl()
  private _isLoading = signal(true);
  readonly isLoading = this._isLoading.asReadonly()

  setIsLoading(val: boolean) {
    this._isLoading.set(val)
  }

  async getUserlist(id: number, page: number, size: number) {
    if (page <= 0 || size <= 0) {
      console.log(`Invalid page or size value: page: ${page}, size: ${size}`)
      this.setIsLoading(false)
      return
    }

    try {
      const res = await firstValueFrom(
        this.http.get<GetUserListResponse>(`${this.baseUrl}/settings/company-users/${id}?page=${page - 1}&size=${size}`)
      )
      console.log(res)
      return res
    } catch (error) {
      console.log("Couldn't get user list: ", error)
      this.setIsLoading(false)
      throw error
    }
  }

  async inviteAdmin(credentials: AdminInviteCredentials) {
    try {
      const res = await firstValueFrom(
        this.http.post<any>(`${this.baseUrl}/api/invitations/invite`, credentials)
      )
      console.log(res)
      return res
    } catch (error) {
      console.log("Couldn't invite admin: ", error)
      throw error
    }
  }

  // async addCashier(credentials: CashierCredentials) {
  //   try {
  //     const res = await firstValueFrom(
  //       this.http.post<any>(`${this.baseUrl}/settings/add-cashier`, credentials)
  //     )
  //     this.users.set(res.userList)
  //     this._currentPage.set(res.currentPage + 1)
  //     this._totalPages.set(res.totalPages)
  //     console.log(res)
  //     return res
  //   } catch (error) {
  //     console.log("Couldn't add the cashier: ", error)
  //     throw error
  //   }
  // }

  async getUserInfo() {
    try {
      const res = await firstValueFrom(this.http.get<User>(`${this.baseUrl}/settings/account`))
      console.log(res)
      return res
    } catch (error) {
      console.log("Couldn't get user info: ", error)
      throw error
    }
  }

  async deleteUser(userId: number) {
    try {
      const res = await firstValueFrom(this.http.delete<any>(`${this.baseUrl}/settings/users/${userId}`))
      console.log(res)
      return res
    } catch (error) {
      console.log("Couldn't delete user: ", error)
      throw error
    }
  }

  async getCompanyById(companyId: number) {
    try {
      console.log('Sending getCompanyId() request to: ', `${this.baseUrl}/settings/company/${companyId}`)
      const res = await firstValueFrom(this.http.get<CompanyDTO>(`${this.baseUrl}/settings/company/${companyId}`))
      console.log(res)
      return res
    } catch (error) {
      console.log("Couldn't get company by id: ", error)
      throw error
    }
  }

  async deleteCompany(companyId: number) {
    try {
      const res = await firstValueFrom(this.http.delete<any>(`${this.baseUrl}/settings/company/${companyId}`))
      console.log(res)
      return res
    } catch (error) {
      console.log("Couldn't delete company: ", error)
      throw error
    }
  }

  async sendCompanyBusinessInfoUpdateRequest(newInfo: CompanyDTO) {
    try {
      const res = await firstValueFrom(this.http.
        post<CredentialsUpdateRequestResponse>(`${this.baseUrl}/settings/company/verify`, newInfo))
      console.log('Received company update response: ', res)
      return res
    } catch (error) {
      console.log("Couldn't update company: ", error)
      throw error
    }
  }

  async updateCompanyBusinessInfo(newInfo: CompanyDTO, verificationInfo: VerificationCredentials) {
    try {
      console.log('Sending: ', {verificationInfo, newInfo })
      const res = await firstValueFrom(this.http.put<CompanyDTO>(`${this.baseUrl}/settings/company`, 
        {verificationInfo, newInfo }))
      console.log('Received company update response: ', res)
      return res
    } catch (error) {
      console.log("Couldn't update company: ", error)
      throw error
    }
  }

  async searchUsers(searchTerm: string) {
    console.log('Search term is: ', searchTerm)
    const users = await firstValueFrom(
      this.http.get<User[]>(`${this.baseUrl}/settings/search?searchTerm=${searchTerm}`)
    )
    console.log('The returned user list is: ', users)
    return users
  }

  async verifyPersonalInfoUpdateRequest(newInfo: User) {
    try {
      const res = await firstValueFrom(this.http.post<CredentialsUpdateRequestResponse>
        (`${this.baseUrl}/settings/account/verify`, newInfo))
      console.log(res)
      return res
    } catch (error) {
      console.log("Couldn't verify personal info update request: ", error)
      throw error
    }
  }

  async updatePersonalInfo(newInfo: User, verificationInfo: VerificationCredentials) {
    try {
      console.log('Sending: ', {newInfo, verificationInfo})
      const res = await firstValueFrom(this.http.put<User>(`${this.baseUrl}/settings/account`,
        {newInfo, verificationInfo}))
      console.log(res)
      return res
    } catch (error) {
      console.log("Couldn't update personal info: ", error)
      throw error
    }
  }

  async addProductAttribute(productAttribute: ProductAttribute) {
    try {
      const res = await firstValueFrom(this.http.post(`${this.baseUrl}/api/products/attributes`, productAttribute))
      console.log(res)
      return res
    } catch (error) {
      console.log("Couldn't add product attribute: ", error)
      throw error
    }
  }
}