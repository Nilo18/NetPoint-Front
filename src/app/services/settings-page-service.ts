import { inject, Injectable } from '@angular/core';
import { BackendUrlHolderService } from './backend-url-holder-service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

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
  totalPages: number
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

@Injectable({
  providedIn: 'root',
})
export class SettingsPageService {
  private urlHolderService = inject(BackendUrlHolderService)
  private http = inject(HttpClient)
  private baseUrl = this.urlHolderService.getBaseUrl()

  async getUserlist(id: number, page: number, size: number) {
    try {
      const res = await firstValueFrom(
        this.http.get<GetUserListResponse>(`${this.baseUrl}/settings/company-users/${id}?page=${page}&size=${size}`)
      )
      console.log(res)
      return res
    } catch (error) {
      console.log("Couldn't get user list: ", error)
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

  async addCashier(credentials: CashierCredentials) {
    try {
      const res = await firstValueFrom(
        this.http.post<any>(`${this.baseUrl}/settings/add-cashier`, credentials)
      )
      console.log(res)
      return res
    } catch (error) {
      console.log("Couldn't add the cashier: ", error)
      throw error
    }
  }
}
