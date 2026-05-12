import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { TokenService } from '../services/token-service';
import { jwtDecode } from 'jwt-decode';

export const settingsPageGuard: CanActivateFn = (route, state) => {
  return true;
};
