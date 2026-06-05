import { ChangeDetectionStrategy, Component, inject, resource, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth-service';
import { DecodedToken, TokenService } from '../../../services/token-service';
import { CompanyDTO, CompanyService } from '../../../services/company-service';

@Component({
  selector: 'app-admin-dashboard-header',
  imports: [NgOptimizedImage],
  templateUrl: './admin-dashboard-header.html',
  styleUrl: './admin-dashboard-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardHeader {
  private router = inject(Router)
  private authService = inject(AuthService)
  private tokenService = inject(TokenService)
  private companyService = inject(CompanyService)
  companyInfo = resource({
    loader: () => this.companyService.getCompanyInfo()
  });
  decodedToken!: DecodedToken

  ngOnInit() {
    const token = this.tokenService.getDecodedToken()

    if (token) {
      this.decodedToken = token
      console.log(this.decodedToken.role)
    }
  }

  logout() {
    this.authService.logout()
  }

  navToSettings() {
    this.router.navigate(['/settings'])
  }
}
