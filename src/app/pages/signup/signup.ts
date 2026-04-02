import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormValidatorService } from '../../services/form-validator-service';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  signupForm!: FormGroup
  signupFormStageTwo!: FormGroup
  showNextStep: boolean = false
  gotBackendError = signal(false)
  requestSent = signal(false)
  backendErrorMsg = signal('')
  private formValidator = inject(FormValidatorService)
  private fb = inject(FormBuilder) 
  private authService = inject(AuthService)
  private router = inject(Router)
  private cdr = inject(ChangeDetectorRef)

  ngOnInit() {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', [Validators.required]],
    }, { validators: this.formValidator.passwordMatchValidator() })

    this.signupFormStageTwo = this.fb.group({
      name: ['', [Validators.required]],
      industry: ['', [Validators.required]]
    })
    console.log(this.email)
  }

  setShowNextStep(val: boolean) {
    this.showNextStep = val
  }

  get email() {
    return this.signupForm.value.email
  }

  getError(field: string, form: FormGroup) {
    return this.formValidator.getError(field, form)
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched()
      console.log('The form is invalid.')
      console.log(this.formValidator.getError('confirm_password', this.signupFormStageTwo))
      return this.formValidator.getError('confirm_password', this.signupFormStageTwo)
    }

    if (!this.showNextStep) {
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
    if (this.signupFormStageTwo.invalid) {
      this.signupFormStageTwo.markAllAsTouched()
      console.log('The form is invalid.')
      return
    }

    if (this.showNextStep) {
      this.requestSent.set(true)
      this.gotBackendError.set(false)
      const { confirm_password, ...payload } = this.signupForm.value
      const finalFormValue = { ...payload, ...this.signupFormStageTwo.value }
      console.log(finalFormValue)
      try {
        await this.authService.signup(finalFormValue)
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
