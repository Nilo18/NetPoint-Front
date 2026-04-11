import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { FormValidatorService } from '../../services/form-validator-service';
import { AuthBanner } from '../../components/auth-banner/auth-banner';
import { CashierLoginForm } from '../../components/cashier-login-form/cashier-login-form';
import { AdminLoginFirstStageForm } from '../../components/admin-login-first-stage-form/admin-login-first-stage-form';
import { AdminLoginSecondStageForm } from '../../components/admin-login-second-stage-form/admin-login-second-stage-form';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule, 
    AuthBanner, FormsModule, 
    CashierLoginForm, AdminLoginFirstStageForm,
    AdminLoginSecondStageForm
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  showNextStep: WritableSignal<boolean> = signal(false)
  loginForm!: FormGroup
  loginFormStageTwo!: FormGroup
  gotBackendError = signal(false)
  requestSent = signal(false)
  backendErrorMsg = signal('')
  private formValidator = inject(FormValidatorService)
  private fb = inject(FormBuilder) 
  private authService = inject(AuthService)
  private router = inject(Router)
  
  checkboxValues = {
    owner: signal(true),
    admin: signal(false),
    cashier: signal(false)
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['', [Validators.required]]
    })

    this.loginFormStageTwo = this.fb.group({
      otpCode: ['', [Validators.required]]
    })
    // console.log(this.email)
  }

  setCheckboxValue(field: string) {
    const stdField = field.trim().toLocaleLowerCase()
    if (stdField === '') return

    if (stdField === 'owner') {
      this.checkboxValues.owner.set(true)
      this.checkboxValues.admin.set(false)
      this.checkboxValues.cashier.set(false)
    }

    if (stdField === 'admin') {
      this.checkboxValues.admin.set(true)
      this.checkboxValues.owner.set(false)
      this.checkboxValues.cashier.set(false)
    }

    if (stdField === 'cashier') {
      this.checkboxValues.cashier.set(true)
      this.checkboxValues.admin.set(false)
      this.checkboxValues.owner.set(false)
    }
  }

  setShowNextStep(val: boolean) {
    this.showNextStep.set(val)
    console.log('Set showNextStep to: ', val)
  }

  get email() {
    return this.loginForm.value.email
  }

  getError(field: string, form: FormGroup) {
    return this.formValidator.getError(field, form)
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched()
      console.log('The form is invalid.')
      console.log(this.formValidator.getError('confirm_password', this.loginFormStageTwo))
      return this.formValidator.getError('confirm_password', this.loginFormStageTwo)
    }

    if (!this.showNextStep()) {
      this.setShowNextStep(true)
      console.log('Showing next step...')
      // return
    } 

    return
    // else {
    //   console.log(this.signupForm.value)
    //   // return
    // }
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
      const { confirm_password, ...payload } = this.loginForm.value
      const finalFormValue = { ...payload, ...this.loginFormStageTwo.value }
      console.log(finalFormValue)
      // return
      try {
        const res = await this.authService.signup(finalFormValue)
        localStorage.setItem('net_token', res)
        this.router.navigate(['/admin'])
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
}
