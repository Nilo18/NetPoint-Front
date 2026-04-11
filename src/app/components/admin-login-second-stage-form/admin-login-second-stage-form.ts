import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { FormValidatorService } from '../../services/form-validator-service';

@Component({
  selector: 'app-admin-login-second-stage-form',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-login-second-stage-form.html',
  styleUrl: './admin-login-second-stage-form.scss',
})
export class AdminLoginSecondStageForm {
  loginFormStageTwo!: FormGroup
  showNextStep: WritableSignal<boolean> = signal(false)
  gotBackendError = signal(false)
  requestSent = signal(false)
  backendErrorMsg = signal('')
  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private router = inject(Router)
  private formValidator = inject(FormValidatorService)

  ngOnInit() {
    this.loginFormStageTwo = this.fb.group({
      otpCode: ['', [Validators.required]]
    })
  }

  setShowNextStep(val: boolean) {
    this.showNextStep.set(val)
    console.log('Set showNextStep to: ', val)
  }

  async onFinalSubmit() {
    if (this.loginFormStageTwo.invalid) {
      this.loginFormStageTwo.markAllAsTouched()
      console.log('The form is invalid.')
      return
    }

    if (this.showNextStep()) {
      this.requestSent.set(true)
      this.gotBackendError.set(false)
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
        this.requestSent.set(false)
        this.gotBackendError.set(true)
        switch (error.status) {
          case 400:
            this.backendErrorMsg.set('Please make sure all fields are filled in correctly.')
            break;
          case 409:
            this.backendErrorMsg.set('An account with this email already exists.')
            break;
          case 500:
            this.backendErrorMsg.set('Something went wrong on our end. Please try again later.')
            break;
          default:
            this.backendErrorMsg.set('Something went wrong. Please try again.')
        }
        // this.cdr.detectChanges()
        console.log('requestSent:', this.requestSent)
        console.log('gotBackendError:', this.gotBackendError)
        console.log('backendErrorMsg:', this.backendErrorMsg)
        console.log(this.backendErrorMsg)
      }      
    }
  }

  getError(field: string, form: FormGroup) {
    return this.formValidator.getError(field, form)
  }
}
