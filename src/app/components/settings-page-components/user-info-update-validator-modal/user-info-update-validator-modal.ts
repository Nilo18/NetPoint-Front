import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormValidatorService } from '../../../services/form-validator-service';
import { SettingsPageService, User } from '../../../services/settings-page-service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-info-update-validator-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './user-info-update-validator-modal.html',
  styleUrl: './user-info-update-validator-modal.scss',
})
export class UserInfoUpdateValidatorModal {
  public modal = inject(NgbActiveModal)
  private fb = inject(FormBuilder)
  private formValidator = inject(FormValidatorService)
  private settingsService = inject(SettingsPageService)
  tempToken!: string
  userInfo!: User
  newPassword!: string
  verificationForm!: FormGroup
  gotBackendError: WritableSignal<boolean> = signal(false)
  errMsg: WritableSignal<string> = signal('')
  requestSent: WritableSignal<boolean> = signal(false)

  ngOnInit() {
    console.log('Received userInfo as: ', this.userInfo)

    this.verificationForm = this.fb.group({
      tempToken: [this.tempToken || '', [Validators.required]],
      otpCode: ['', [Validators.required, Validators.maxLength(6)]]
    })
  }

  getError(field: string, form: FormGroup) {
    return this.formValidator.getError(field, form)
  }

  async onSubmit() {
    console.log('I run')
    if (this.verificationForm.invalid) {
      this.verificationForm.markAllAsTouched()
      console.log('Invalid form: ', this.verificationForm.value)
      return
    }

    if (!this.userInfo) {
      console.log('User info missing: ', this.userInfo)
      return
    }

    this.requestSent.set(true)
    this.gotBackendError.set(false)
    this.errMsg.set('')

    try {
      const res = await this.settingsService.updatePersonalInfo(
        this.userInfo, this.verificationForm.value
      ) 

      if (res) {
        this.requestSent.set(false)
        window.location.reload()
        // setTimeout(() => {
        //   this.modal.close()
        // }, 2000)
      }
    } catch (error: unknown) {
      // console.log(error.error.error)
      this.requestSent.set(false)
      this.gotBackendError.set(true)
      this.errMsg.set(this.getBackendErrorMessage(error))
    }
  }

  private getBackendErrorMessage(error: unknown) {
    if (error instanceof HttpErrorResponse && typeof error.error?.error === 'string') {
      return error.error.error
    }

    return 'Something went wrong. Please try again.'
  }
}
