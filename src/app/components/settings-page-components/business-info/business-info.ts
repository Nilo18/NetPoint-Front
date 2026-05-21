import { Component, inject, signal, WritableSignal } from '@angular/core';
import { SettingsHeader } from '../settings-header/settings-header';
import { SettingsSidebar } from '../settings-sidebar/settings-sidebar';
import { SettingsPageService } from '../../../services/settings-page-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JwtPayload } from 'jwt-decode';
import { DecodedToken, TokenService } from '../../../services/token-service';
import { FormValidatorService } from '../../../services/form-validator-service';
import { Subject, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingsBusinessInfoValidatorModal } from '../settings-business-info-validator-modal/settings-business-info-validator-modal';
import { BackendErrorOverlay } from '../../backend-error-overlay/backend-error-overlay';

@Component({
  selector: 'app-business-info',
  imports: [ReactiveFormsModule],
  templateUrl: './business-info.html',
  styleUrl: './business-info.scss',
})
export class BusinessInfo {
  private settingsService = inject(SettingsPageService)
  private tokenService = inject(TokenService)
  private formValidator = inject(FormValidatorService)
  private modalService = inject(NgbModal)
  private fb = inject(FormBuilder)
  decodedToken!: DecodedToken | null
  businessForm!: FormGroup
  formValueChanged: boolean = false
  gotBackendError: WritableSignal<boolean> = signal(false)
  errMsg: WritableSignal<string> = signal('')
  requestSent: WritableSignal<boolean> = signal(false)
  oldValue = {
    id: -1,
    name: '', 
    email: '',
    industry: ''
  }

  async ngOnInit() {
    console.log('Backend error message on business-info section is: ', this.errMsg())
    this.businessForm = this.fb.group({
      id: [-1 , Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      industry: ['', Validators.required]
    })

    this.decodedToken = this.tokenService.getDecodedToken()

    if (!this.decodedToken) {
      console.log('Invalid decoded token: ', this.decodedToken)
      return
    }

    try {
      const res = await this.settingsService.getCompanyById(this.decodedToken.companyId)

      this.oldValue.id = res.id
      this.oldValue.name = res.name
      this.oldValue.email = res.email
      this.oldValue.industry = res.industry

      this.businessForm.patchValue({
        id: res.id,
        name: res.name,
        email: res.email,
        industry: res.industry
      })
    } catch (error: any) {
      this.gotBackendError.set(true)
      this.errMsg.set(error.error.error)
    }
  }

  getError(field: string, form: FormGroup) {
    return this.formValidator.getError(field, form)
  }

  async onSubmit() {
    // console.log('Comparing: ', this.businessForm.value)
    // console.log('To the old value', this.oldValue)

    if (this.requestSent() === true) {
      console.log('Request already sent')
      return
    }

    if (JSON.stringify(this.businessForm.value) === JSON.stringify(this.oldValue)) {
      console.log('Form value has not changed, avoiding redundant request')
      return
    }

    if (this.businessForm.invalid) {
      this.businessForm.markAllAsTouched()
      console.log('Invalid form.')
      return
    }

    this.requestSent.set(true)
    this.gotBackendError.set(false)
    this.errMsg.set('')

    console.log(this.businessForm.value)
    try {
      const res = await this.settingsService.sendCompanyBusinessInfoUpdateRequest(this.businessForm.value)
      if (res) {
        this.openVerificationModal(res.tempToken)
        this.requestSent.set(false)
      }
    } catch (error: any) {
      this.requestSent.set(false)
      this.gotBackendError.set(true)
      this.errMsg.set(error.error.error)
    }
  }

  openVerificationModal(tempToken: string, event?: MouseEvent) {
    // (event.target as HTMLElement).blur()

    const modalRef = this.modalService.open(SettingsBusinessInfoValidatorModal, {
      centered: true
    })

    modalRef.componentInstance.tempToken = tempToken
    modalRef.componentInstance.companyInfo = this.businessForm.value

    return modalRef
  }
}
