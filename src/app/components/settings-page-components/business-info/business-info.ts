import { Component, inject } from '@angular/core';
import { SettingsHeader } from '../settings-header/settings-header';
import { SettingsSidebar } from '../settings-sidebar/settings-sidebar';
import { SettingsPageService } from '../../../services/settings-page-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JwtPayload } from 'jwt-decode';
import { DecodedToken, TokenService } from '../../../services/token-service';

@Component({
  selector: 'app-business-info',
  imports: [ReactiveFormsModule],
  templateUrl: './business-info.html',
  styleUrl: './business-info.scss',
})
export class BusinessInfo {
  private settingsService = inject(SettingsPageService)
  private tokenService = inject(TokenService)
  private fb = inject(FormBuilder)
  decodedToken!: DecodedToken | null
  businessForm!: FormGroup

  async ngOnInit() {
    this.businessForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      industry: ['', Validators.required]
    })

    this.decodedToken = this.tokenService.getDecodedToken()

    if (!this.decodedToken) {
      console.log('Invalid decoded token: ', this.decodedToken)
      return
    }

    const res = await this.settingsService.getCompanyById(this.decodedToken.companyId)

    this.businessForm.patchValue({
      name: res.name,
      email: res.email,
      industry: res.industry
    })
  }
}
