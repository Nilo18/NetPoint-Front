import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormValidatorService } from '../../../services/form-validator-service';
import { CompanyDTO, SettingsPageService } from '../../../services/settings-page-service';

@Component({
  selector: 'app-settings-business-info-validator-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './settings-business-info-validator-modal.html',
  styleUrl: './settings-business-info-validator-modal.scss',
})
export class SettingsBusinessInfoValidatorModal {
  public modal = inject(NgbActiveModal)
  private fb = inject(FormBuilder)
  private formValidator = inject(FormValidatorService)
  private settingsService = inject(SettingsPageService)
  tempToken!: string
  companyInfo!: CompanyDTO
  verificationForm!: FormGroup

  ngOnInit() {
    console.log('Received companyInfo as: ', this.companyInfo)

    this.verificationForm = this.fb.group({
      tempToken: [this.tempToken || '', [Validators.required]],
      otpCode: ['', [Validators.required, Validators.maxLength(6)]]
    })
  }

  getError(field: string, form: FormGroup) {
    return this.formValidator.getError(field, form)
  }

  async onSubmit() {
    if (this.verificationForm.invalid) {
      this.verificationForm.markAllAsTouched()
      console.log('Invalid form.')
      return
    }

    if (!this.companyInfo) {
      console.log('Company info missing: ', this.companyInfo)
      return
    }

    try {
      const res = await this.settingsService.updateCompanyBusinessInfo(this.companyInfo, this.verificationForm.value) 

      if (res) {
        window.location.reload()
        // setTimeout(() => {
        //   this.modal.close()
        // }, 2000)
      }
    } catch (error) {
      
    }
  }
}
