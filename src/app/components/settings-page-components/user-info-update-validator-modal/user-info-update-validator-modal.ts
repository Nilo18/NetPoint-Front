import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormValidatorService } from '../../../services/form-validator-service';
import { CompanyDTO, SettingsPageService } from '../../../services/settings-page-service';

@Component({
  selector: 'app-user-info-update-validator-modal',
  imports: [],
  templateUrl: './user-info-update-validator-modal.html',
  styleUrl: './user-info-update-validator-modal.scss',
})
export class UserInfoUpdateValidatorModal {
  public modal = inject(NgbActiveModal)
  private fb = inject(FormBuilder)
  private formValidator = inject(FormValidatorService)
  private settingsService = inject(SettingsPageService)
  tempToken!: string
  companyInfo!: CompanyDTO
  verificationForm!: FormGroup
  gotBackendError: WritableSignal<boolean> = signal(false)
  errMsg: WritableSignal<string> = signal('')
  requestSent: WritableSignal<boolean> = signal(false)

  ngOnInit() {
    console.log('Received companyInfo as: ', this.companyInfo)

    this.verificationForm = this.fb.group({
      tempToken: [this.tempToken || '', [Validators.required]],
      otpCode: ['', [Validators.required, Validators.maxLength(6)]]
    })
  }
}
