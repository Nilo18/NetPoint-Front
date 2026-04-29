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

@Injectable({
  providedIn: 'root',
})
export class SettingsPageService {
  private urlHolderService = inject(BackendUrlHolderService)
  private http = inject(HttpClient)
  private baseUrl = this.urlHolderService.getBaseUrl() + '/settings'

  async getUserlist(id: number, page: number, size: number) {
    try {
      const res = await firstValueFrom(
        this.http.get<GetUserListResponse>(`${this.baseUrl}/company-users/${id}?page=${page}&size=${size}`)
      )
      console.log(res)
      return res
    } catch (error) {
      console.log("Couldn't get user list: ", error)
      throw error
    }
  }
}
