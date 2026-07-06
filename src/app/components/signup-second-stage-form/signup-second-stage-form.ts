import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SignupStateManagementService } from '../../services/signup-state-management-service';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { FormValidatorService } from '../../services/form-validator-service';
import { HttpErrorResponse } from '@angular/common/http';
import { BackendErrorHandlerService } from '../../services/backend-error-handler-service';

@Component({
  selector: 'app-signup-second-stage-form',
  imports: [ReactiveFormsModule],
  templateUrl: './signup-second-stage-form.html',
  styleUrl: './signup-second-stage-form.scss',
})
export class SignupSecondStageForm {
  signupFormStageTwo!: FormGroup
  private fb = inject(FormBuilder)
  public signupService = inject(SignupStateManagementService)
  private authService = inject(AuthService)
  private router = inject(Router)
  private formValidator = inject(FormValidatorService)
  private backendErrorHandler = inject(BackendErrorHandlerService)

  ngOnInit() {
    // console.log('Checking the type: ', typeof this.signupFormStageTwo.value);
    this.signupFormStageTwo = this.fb.group({
      owner_name: ['', [Validators.required]],
      owner_email: ['', [Validators.required, Validators.email]],
      owner_password: ['', [Validators.required, Validators.minLength(8)]],
      // phone_number: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      role: ['OWNER']
    })

    const saved = this.signupService.stageTwoData()
    this.signupFormStageTwo.patchValue(saved)
  }

  async onFinalSubmit() {
    if (this.signupFormStageTwo.invalid) {
      this.signupFormStageTwo.markAllAsTouched()
      console.log('The form is invalid.')
      return
    }

    if (this.signupService.showNextStep()) {
      this.signupService.setRequestSent(true)
      this.signupService.setGotBackendError(false)
      // const { confirm_password, ...payload } = this.signupForm.value
      const finalFormValue = this.signupService.buildFinalPayload(this.signupFormStageTwo.value) /*{ ...payload, ...this.signupFormStageTwo.value }*/
      console.log(finalFormValue)
      // return
      try {
        const res = await this.authService.signup(finalFormValue)
        localStorage.setItem('net_token', res)
        this.router.navigate(['/admin'])
      } catch (error: unknown) {
        console.log(error)
        console.log('catch block reached')
        this.signupService.setRequestSent(false)
        this.signupService.setGotBackendError(true)
        const status = error instanceof HttpErrorResponse ? error.status : undefined

        switch (status) {
          case 400:
            this.signupService.setBackendErrorMsg('Please make sure all fields are filled in correctly.')
            break;
          case 409:
            this.signupService.setBackendErrorMsg('An account with this email already exists.')
            break;
          case 500:
            this.signupService.setBackendErrorMsg('Something went wrong on our end. Please try again later.')
            break;
          default:
            this.signupService.setBackendErrorMsg(this.backendErrorHandler.getErrorMessage(error, 'Something went wrong. Please try again.'))
        }
        // this.cdr.detectChanges()
        console.log('requestSent:', this.signupService.requestSent)
        console.log('gotBackendError:', this.signupService.gotBackendError)
        console.log('backendErrorMsg:', this.signupService.backendErrorMsg)
        console.log(this.signupService.backendErrorMsg)
      }      
    }
  }

  getRequiredError(field: string, form: FormGroup): string {
    return this.formValidator.getRequiredError(field, form)
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

  getPhoneNumberError(field: string, form: FormGroup): string {
    return this.formValidator.getFirstError(
      this.formValidator.getRequiredError(field, form),
      this.formValidator.getPatternError(field, form, 'Please enter a valid phone number')
    )
  }

  onBack() {
    this.signupService.setStageTwoData(this.signupFormStageTwo.value)
    this.signupService.setShowNextStep(this.signupService.stageOneData(), false)
  }
}
