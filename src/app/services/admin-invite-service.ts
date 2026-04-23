import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BackendUrlHolderService } from './backend-url-holder-service';
import { firstValueFrom } from 'rxjs';

export interface AdminInviteEndpointResponse {
  status: number,
  message: string
}

@Injectable({
  providedIn: 'root',
})
export class AdminInviteService {
  private http = inject(HttpClient)
  private baseUrlHolder = inject(BackendUrlHolderService)
  private baseUrl = `${this.baseUrlHolder.getBaseUrl()}/api/invitations`

  async verifyInvitation(token: string) {
    try {
      const res = await firstValueFrom(
        this.http.get<AdminInviteEndpointResponse>(`${this.baseUrl}/validate?token=${token}`)
      )
      console.log('The response is: ', res)
      return res
    } catch (error) {
      console.error('Failed to send invitation verification: ', error)
      throw error
    }
  }

}
