import { inject, Injectable } from '@angular/core';
import { BackendUrlHolderService } from './backend-url-holder-service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface SignupData {
  name: string
  email: string
  password: string
  industry: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrlHolder = inject(BackendUrlHolderService)
  private http = inject(HttpClient)
  private baseUrl = this.baseUrlHolder.getBaseUrl()

  async signup(value: SignupData) {
    try {
      const res = await firstValueFrom(this.http.post(`${this.baseUrl}/auth/signup`, value))
      console.log(res)
    } catch (error) {
      console.log('Failed to signup: ', error)
      throw error
    }
  }
}
