import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormValidatorService } from '../../services/form-validator-service';

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
  private formValidator = inject(FormValidatorService)
  private fb = inject(FormBuilder) 

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

  onFinalSubmit() {
    if (this.signupFormStageTwo.invalid) {
      this.signupFormStageTwo.markAllAsTouched()
      console.log('The form is invalid.')
      return
    }

    if (this.showNextStep) {
      console.log(this.signupForm.value)
    }
  }
}
