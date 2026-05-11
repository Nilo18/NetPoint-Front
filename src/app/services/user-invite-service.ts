import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BackendUrlHolderService } from './backend-url-holder-service';
import { firstValueFrom } from 'rxjs';
import { AuthResponse } from './auth-service';

export interface UserInviteEndpointResponse {
  status: number,
  message: string
}

export interface UserRegistrationCredentials {
  name: string,
  email: string,
  password: string,
  role: 'ADMIN'
}

@Injectable({
  providedIn: 'root',
})
export class UserInviteService {
  private http = inject(HttpClient)
  private baseUrlHolder = inject(BackendUrlHolderService)
  private baseUrl = `${this.baseUrlHolder.getBaseUrl()}/api/invitations`

  async verifyInvitation(token: string) {
    try {
      const res = await firstValueFrom(
        this.http.get<UserInviteEndpointResponse>(`${this.baseUrl}/validate?token=${token}`)
      )
      console.log('The response is: ', res)
      return res
    } catch (error) {
      console.error('Failed to send invitation verification: ', error)
      throw error
    }
  }

  async completeRegistration(token: string, credentials: UserRegistrationCredentials) {
    try {
      const res = await firstValueFrom(this.http.post<AuthResponse>(
        `${this.baseUrl}/complete?token=${token}`, credentials
      ))
      console.log(res)
      return res
    } catch (error) {
      console.error('Failed to send invitation verification: ', error)
      throw error
    }
  }
}
