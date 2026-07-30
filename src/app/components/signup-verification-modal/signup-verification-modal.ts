import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { AuthService, SignupAuthResponse } from '../../services/auth-service'
import { BackendErrorHandlerService } from '../../services/backend-error-handler-service'
import { FormValidatorService } from '../../services/form-validator-service'
import {
  SignupStageOneData,
  SignupStageTwoData,
  SignupStateManagementService,
} from '../../services/signup-state-management-service'

@Component({
  selector: 'app-signup-verification-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './signup-verification-modal.html',
  styleUrl: './signup-verification-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupVerificationModal {
  readonly modal = inject(NgbActiveModal)
  private readonly fb = inject(FormBuilder)
  private readonly authService = inject(AuthService)
  private readonly signupState = inject(SignupStateManagementService)
  private readonly formValidator = inject(FormValidatorService)
  private readonly backendErrorHandler = inject(BackendErrorHandlerService)
  private readonly router = inject(Router)

  stageOneData!: SignupStageOneData
  stageTwoData!: SignupStageTwoData
  authResponse!: SignupAuthResponse

  readonly requestSent = signal(false)
  readonly gotBackendError = signal(false)
  readonly errMsg = signal('')

  readonly verificationForm = this.fb.nonNullable.group({
    companyOtpCode: ['', [Validators.required, Validators.maxLength(6)]],
    userOtpCode: ['', [Validators.required, Validators.maxLength(6)]],
  })

  getOtpCodeError(field: 'companyOtpCode' | 'userOtpCode'): string {
    return this.formValidator.getFirstError(
      this.formValidator.getRequiredError(field, this.verificationForm),
      this.formValidator.getMaxLengthError(field, this.verificationForm),
    )
  }

  async onSubmit() {
    if (this.verificationForm.invalid) {
      this.verificationForm.markAllAsTouched()
      return
    }

    if (!this.stageOneData || !this.stageTwoData || !this.authResponse) {
      this.gotBackendError.set(true)
      this.errMsg.set('Signup verification details are missing. Please restart signup.')
      return
    }

    this.requestSent.set(true)
    this.gotBackendError.set(false)
    this.errMsg.set('')

    const payload = this.signupState.buildFinalPayload(
      this.stageTwoData,
      {
        ...this.verificationForm.getRawValue(),
        companyTempToken: this.authResponse.companyTempToken,
        userTempToken: this.authResponse.userTempToken,
      },
      this.stageOneData,
    )

    try {
      const token = await this.authService.signup(payload)
      localStorage.setItem('net_token', token)
      this.signupState.hardRefreshSignupState()
      this.modal.close()
      await this.router.navigate(['/admin'])
    } catch (error: unknown) {
      this.requestSent.set(false)
      this.gotBackendError.set(true)
      this.errMsg.set(
        this.backendErrorHandler.getErrorMessage(
          error,
          'Verification failed. Please check both codes and try again.',
        ),
      )
    }
  }
}
