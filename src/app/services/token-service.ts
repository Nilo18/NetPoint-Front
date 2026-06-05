import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
  userId: number,
  companyId: number,
  name: string,
  email: string,
  industry: string,
  role: string
}

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly tokenKey = 'net_token'

  getToken() {
    return localStorage.getItem(this.tokenKey)
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token)
  }

  clearToken() {
    localStorage.removeItem(this.tokenKey)
  }

  hasToken() {
    return !!this.getToken()
  }

  getDecodedToken(): DecodedToken | null {
    const encodedToken = localStorage.getItem(this.tokenKey)

    return encodedToken ? jwtDecode<DecodedToken>(encodedToken) : null
  }
}
