import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormValidatorService {
  passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('password')?.value
      const confirmPassword = formGroup.get('confirm_password')?.value

      console.log(`Compared ${password} to ${confirmPassword}`)

      return password === confirmPassword ? null : { passwordMismatch: true }
    }
  }

  formatLabel(field: string): string {
    return field
      .replace(/_/g, ' ')                        
      .replace(/^\w/, c => c.toUpperCase());    
  }

  getRequiredError(field: string, form: FormGroup): string {
    const control = form.get(field)

    if (!control || !control.touched) return ''

    return control.hasError('required') ? `${this.formatLabel(field)} is required.` : ''
  }

  getEmailError(field: string, form: FormGroup): string {
    const control = form.get(field)

    if (!control || !control.touched) return ''

    return control.hasError('email') ? 'Invalid email address.' : ''
  }

  getMinLengthError(field: string, form: FormGroup, label = this.formatLabel(field)): string {
    const control = form.get(field)

    if (!control || !control.touched || !control.hasError('minlength')) return ''

    const minLengthError = control.getError('minlength') as { requiredLength: number }

    return `${label} must be at least ${minLengthError.requiredLength} characters long`
  }

  getMaxLengthError(field: string, form: FormGroup): string {
    const control = form.get(field)

    if (!control || !control.touched || !control.hasError('maxlength')) return ''

    const maxLengthError = control.getError('maxlength') as { requiredLength: number }

    return `${this.formatLabel(field)} must be at most ${maxLengthError.requiredLength} characters long`
  }

  getPatternError(field: string, form: FormGroup, message = 'Pattern mismatch'): string {
    const control = form.get(field)

    if (!control || !control.touched) return ''

    return control.hasError('pattern') ? message : ''
  }

  getPasswordMismatchError(field: string, form: FormGroup): string {
    const control = form.get(field)

    if (!control || !control.touched) return ''

    return form.hasError('passwordMismatch') ? 'Passwords do not match' : ''
  }

  getFirstError(...errors: string[]): string {
    return errors.find(Boolean) ?? ''
  }

  getMinAmountError(field: string, form: FormGroup, label = this.formatLabel(field)): string {
    const control = form.get(field)

    if (!control || !control.hasError('min')) return ''

    const minAmountError = control.getError('min') as { min: number; actual: number }

    return `${label} must be at least ${minAmountError.min}`
  }

  getMaxAmountError(field: string, form: FormGroup, label = this.formatLabel(field)): string {
    const control = form.get(field)

    if (!control || !control.hasError('max')) return ''

    const maxAmountError = control.getError('max') as { max: number; actual: number }

    return `${label} must be at most ${maxAmountError.max}`
  }

  getRequiredAmountError(field: string, form: FormGroup, label = this.formatLabel(field)): string {
    return this.getFirstError(
      this.getRequiredError(field, form),
      this.getMinAmountError(field, form, label),
      this.getMaxAmountError(field, form, label)
    )
  }
}
