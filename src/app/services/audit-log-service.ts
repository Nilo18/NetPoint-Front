import { inject, Injectable } from '@angular/core';
import { BackendUrlHolderService } from './backend-url-holder-service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuditLogService {
  private backendUrlHolderService = inject(BackendUrlHolderService)
  private http = inject(HttpClient)
  private baseUrl: string = this.backendUrlHolderService.getBaseUrl()

  async getAuditLogs() {
    
  }
}
