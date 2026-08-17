import { inject, Injectable } from '@angular/core';
import { BackendUrlHolderService } from './backend-url-holder-service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

export interface SignupData {
  name: string
  email: string
  password: string
  industry: string
  owner_email: string
  owner_name: string
  owner_password: string
  role: string
  companyOtpCode: string
  companyTempToken: string
  userOtpCode: string
  userTempToken: string
}

export interface LoginData {
  email: string
  password: string
  role: string
}

export interface TwoFactorCredentials {
  otpCode: string
  tempToken: string
}

export interface AuthResponse {
  status: number
  token: string
}

export interface SignupFirstStageCredentials {
  companyEmail: string,
  userEmail: string
}

export interface SignupAuthResponse {
  status: string
  companyTempToken: string
  userTempToken: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrlHolder = inject(BackendUrlHolderService)
  private http = inject(HttpClient)
  private baseUrl = this.baseUrlHolder.getBaseUrl()
  private router = inject(Router)

  async signup2fa(credentials: SignupFirstStageCredentials): Promise<SignupAuthResponse> {
    try {
      const res = await firstValueFrom(
        this.http.post<SignupAuthResponse>(`${this.baseUrl}/auth/signup/verify`, credentials)
      )
      console.log(res)
      return res
    } catch (error) {
      console.log('Failed to verify signup attempt: ', error)
      throw error
    }
  }

  async signup(value: SignupData | FormData): Promise<string> {
    try {
      const res = await firstValueFrom(
        this.http.post<{ access_token: string }>(`${this.baseUrl}/auth/signup`, value)
      )
      console.log(res)
      return res.access_token
    } catch (error) {
      console.log('Failed to signup: ', error)
      throw error
    }
  }

  async login(value: LoginData) {
    try {
      const res = await firstValueFrom(this.http.post<any>(`${this.baseUrl}/auth/login`, value))
      console.log(res)
      return res
    } catch (error) {
      console.log('Failed to login: ', error)
      throw error      
    }
  }

  async login2fa(value: TwoFactorCredentials) {
    try {
      const res = await firstValueFrom(this.http.post<any>(`${this.baseUrl}/auth/verify-2fa`, value))
      console.log(res)
      return res.token
    } catch (error) {
      console.log('Failed to signup: ', error)
      throw error      
    }
  }

  logout() {
    localStorage.removeItem('net_token')
    this.router.navigate(['/'])
  }
}
