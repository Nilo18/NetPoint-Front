import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { FormValidatorService } from '../../services/form-validator-service';
import { SignupStateManagementService } from '../../services/signup-state-management-service';

@Component({
  selector: 'app-signup-first-stage-form',
  imports: [ReactiveFormsModule],
  templateUrl: './signup-first-stage-form.html',
  styleUrl: './signup-first-stage-form.scss',
})
export class SignupFirstStageForm {
  signupForm!: FormGroup
  showNextStep: WritableSignal<boolean> = signal(false)
  gotBackendError = signal(false)
  requestSent = signal(false)
  backendErrorMsg = signal('')
  private formValidator = inject(FormValidatorService)
  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private signupService = inject(SignupStateManagementService)

  ngOnInit() {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      industry: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', [Validators.required]],
    }, { validators: this.formValidator.passwordMatchValidator() })

    const saved = this.signupService.stageOneData()
    this.signupForm.patchValue(saved)
  }

  getError(field: string, form: FormGroup) {
    return this.formValidator.getError(field, form)
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched()
      console.log('The form is invalid.')
      // console.log(this.formValidator.getError('confirm_password', this.signupFormStageTwo))
      // return this.formValidator.getError('confirm_password', this.signupFormStageTwo)
      return
    }

    if (!this.showNextStep()) {
      this.signupService.setStageOneData(this.signupForm.value)
      this.signupService.setShowNextStep(this.signupForm.value ,true)
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
