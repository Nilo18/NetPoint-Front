import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { FormValidatorService } from '../../services/form-validator-service';
import { LoginStateManagementService } from '../../services/login-state-management-service';

@Component({
  selector: 'app-admin-login-second-stage-form',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-login-second-stage-form.html',
  styleUrl: './admin-login-second-stage-form.scss',
})
export class AdminLoginSecondStageForm {
  loginFormStageTwo!: FormGroup
  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private router = inject(Router)
  private formValidator = inject(FormValidatorService)
  public loginStateService = inject(LoginStateManagementService)

  ngOnInit() {
    this.loginFormStageTwo = this.fb.group({
      otpCode: ['', [Validators.required]]
    })
  }

  setShowNextStep(val: boolean) {
    this.loginStateService.setShowLoginNextStep(val)
    console.log('Set showNextStep to: ', val)
  }

  async onFinalSubmit() {
    if (this.loginFormStageTwo.invalid) {
      this.loginFormStageTwo.markAllAsTouched()
      console.log('The form is invalid.')
      return
    }

    if (this.loginStateService.showLoginNextStep()) {
      this.loginStateService.setRequestSent(true)
      this.loginStateService.setGotBackendLoginError(false)
      // const { confirm_password, ...payload } = this.loginForm.value
      // const finalFormValue = { ...payload, ...this.loginFormStageTwo.value }
      // console.log(finalFormValue)
      // return
      try {
        // const res = await this.authService.signup(finalFormValue)
        // localStorage.setItem('net_token', res)
        // this.router.navigate(['/admin'])
      } catch (error: any) {
        console.log(error)
        console.log(error.error)
        console.log('catch block reached')
        console.log('error status:', error.status)
        this.loginStateService.setRequestSent(false)
        this.loginStateService.setGotBackendLoginError(true)
        switch (error.status) {
          case 400:
            this.loginStateService.setBackendLoginErrorMsg('Please make sure all fields are filled in correctly.')
            break;
          case 409:
            this.loginStateService.setBackendLoginErrorMsg('An account with this email already exists.')
            break;
          case 500:
            this.loginStateService.setBackendLoginErrorMsg('Something went wrong on our end. Please try again later.')
            break;
          default:
            this.loginStateService.setBackendLoginErrorMsg('Something went wrong. Please try again.')
        }
        // this.cdr.detectChanges()
        console.log('requestSent:', this.loginStateService.requestSent())
        console.log('gotBackendError:', this.loginStateService.gotBackendLoginError())
        console.log('backendErrorMsg:', this.loginStateService.backendLoginErrorMsg())
        console.log(this.loginStateService.backendLoginErrorMsg())
      }
    }
  }

  getError(field: string, form: FormGroup) {
    return this.formValidator.getError(field, form)
  }
}