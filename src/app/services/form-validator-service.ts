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

  getError(field: string, form: FormGroup) {
    const control = form.get(field)
    const label = this.formatLabel(field)
    // console.log(label)

    if (!control || !control.touched) return ''

    if (control.hasError('required')) { 
      // field.charAt(0)
      return `${label} is required.`
    }
    if (control.hasError('email')) return 'Invalid email address.'
    if (control.hasError('minlength')) {
      const min = control.getError('minlength').requiredLength
      console.log(control.getError('minlength'))
      console.log('value of min is: ', min)
      return `${label} must be at least ${min} characters long`
    }

    if (field === 'confirm_password' && form.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }

    return ''
  }
}
