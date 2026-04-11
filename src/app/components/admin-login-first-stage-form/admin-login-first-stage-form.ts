import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormValidatorService } from '../../services/form-validator-service';

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
  showNextStep: WritableSignal<boolean> = signal(false)

  ngOnInit() {
    // console.log(this.bannerFeatures)
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['', [Validators.required]]
    })

    // this.loginFormStageTwo = this.fb.group({
    //   otpCode: ['', [Validators.required]]
    // })
    // console.log(this.email)
  }

  setShowNextStep(val: boolean) {
    this.showNextStep.set(val)
    console.log('Set showNextStep to: ', val)
  }

  getError(field: string, form: FormGroup) {
    return this.formValidator.getError(field, form)
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched()
      console.log('The form is invalid.')
      // console.log(this.formValidator.getError('confirm_password', this.loginFormStageTwo))
      // return this.formValidator.getError('confirm_password', this.loginFormStageTwo)
      return
    }

    if (!this.showNextStep()) {
      this.setShowNextStep(true)
      console.log('Showing next step...')
      // return
    } 

    // return
    // else {
    //   console.log(this.signupForm.value)
    //   // return
    // }
  }
}
