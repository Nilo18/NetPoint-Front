import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormValidatorService } from '../../../services/form-validator-service';
import { LoginStateManagementService } from '../../../services/login-state-management-service';
import { AuthService } from '../../../services/auth-service';
import { BackendErrorHandlerService } from '../../../services/backend-error-handler-service';

@Component({
  selector: 'app-admin-login-first-stage-form',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-login-first-stage-form.html',
  styleUrl: './admin-login-first-stage-form.scss',
})
export class AdminLoginFirstStageForm {
  loginForm!: FormGroup
  private fb = inject(FormBuilder)
  private formValidator = inject(FormValidatorService)
  // showNextStep: WritableSignal<boolean> = signal(false)
  public loginStateService = inject(LoginStateManagementService)
  public authService = inject(AuthService)
  private backendErrorHandler = inject(BackendErrorHandlerService)

  constructor() {
    effect(() => {
      this.loginForm?.patchValue({ role: this.loginStateService.role() })
    })
  }
  
  ngOnInit() {
    // console.log(this.bannerFeatures)
    this.loginStateService.refreshLoginState()
    
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: [this.loginStateService.role(), [Validators.required]]
    })

    const saved = this.loginStateService.loginStageOneData()
    this.loginForm.patchValue(saved)
    // this.loginFormStageTwo = this.fb.group({
    //   otpCode: ['', [Validators.required]]
    // })
    // console.log(this.email)
  }

  setShowNextStep(val: boolean) {
    this.loginStateService.setShowLoginNextStep(val)
    console.log('Set showNextStep to: ', val)
  }

  getEmailError(field: string, form: FormGroup): string {
    return this.formValidator.getFirstError(
      this.formValidator.getRequiredError(field, form),
      this.formValidator.getEmailError(field, form)
    )
  }

  getPasswordError(field: string, form: FormGroup): string {
    return this.formValidator.getFirstError(
      this.formValidator.getRequiredError(field, form),
      this.formValidator.getMinLengthError(field, form)
    )
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched()
      console.log('The form is invalid.')
      console.log(this.loginForm.value)
      return
    }

    console.log(this.loginForm.value)
    // return
    if (!this.loginStateService.showLoginNextStep()) {
      // this.loginStateService.setGotBackendLoginError(false)
      // this.loginStateService.setBackendLoginErrorMsg('')
      // this.loginStateService.setRequestSent(true)
      this.loginStateService.clearLoginError()
      // Determine the role dynamically
      const role = this.loginStateService.role().trim().toUpperCase() 
      const payload = {
        ...this.loginForm.value,
        role: role
      }
      try {
        console.log('Sending request...')
        const res = await this.authService.login(payload) 
        this.loginStateService.setTempToken(res.token)
      } catch (error: unknown) {
        console.log('Not showing next step because got error: ', error)
        this.loginStateService.setGotBackendLoginError(true)
        this.loginStateService.setRequestSent(false)
        this.loginStateService.setBackendLoginErrorMsg(this.backendErrorHandler.getErrorMessage(error, 'Something went wrong. Please try again.'))
        return
      }
      this.loginStateService.setShowLoginNextStep(true)
      this.loginStateService.setStageOneData(payload)
      console.log('Showing next step...')
      console.log(payload)
    } 
  }
}
