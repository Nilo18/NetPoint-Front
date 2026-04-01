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
  showNextStep: boolean = false
  private formValidator = inject(FormValidatorService)
  private fb = inject(FormBuilder) 

  ngOnInit() {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, /*Validators.minLength(8)*/]],
      confirm_password: ['', [Validators.required]],
      name: ['', [Validators.required]],
      industry: ['', [Validators.required]]
    }, { validators: this.formValidator.passwordMatchValidator() })
  }

  setShowNextStep(val: boolean) {
    this.showNextStep = val
  }
}
