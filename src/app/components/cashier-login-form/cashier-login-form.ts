import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormValidatorService } from '../../services/form-validator-service';

@Component({
  selector: 'app-cashier-login-form',
  imports: [ReactiveFormsModule],
  templateUrl: './cashier-login-form.html',
  styleUrl: './cashier-login-form.scss',
})
export class CashierLoginForm {
  private fb = inject(FormBuilder)
  private formValidator = inject(FormValidatorService)
  cashierForm!: FormGroup

  ngOnInit() {
    this.cashierForm = this.fb.group({
      email: ['', [Validators.required ,Validators.email]],
      pin: ['', [Validators.required]]
    })
  }  

  onSubmit() {

  }

  getEmailError(field: string, form: FormGroup): string {
    return this.formValidator.getFirstError(
      this.formValidator.getRequiredError(field, form),
      this.formValidator.getEmailError(field, form)
    )
  }

  getRequiredError(field: string, form: FormGroup): string {
    return this.formValidator.getRequiredError(field, form)
  }
}
