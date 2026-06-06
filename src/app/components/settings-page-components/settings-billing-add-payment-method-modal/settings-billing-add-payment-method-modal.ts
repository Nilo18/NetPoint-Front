import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormValidatorService } from '../../../services/form-validator-service';
import { SettingsPageService } from '../../../services/settings-page-service';

type NumericPaymentMethodControl = 'cardNumber' | 'expiryYear' | 'cvc';

@Component({
  selector: 'app-settings-billing-add-payment-method-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './settings-billing-add-payment-method-modal.html',
  styleUrl: './settings-billing-add-payment-method-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsBillingAddPaymentMethodModal {
  protected readonly modal = inject(NgbActiveModal);
  private formValidator = inject(FormValidatorService)
  private settingsService = inject(SettingsPageService)
  protected readonly paymentMethodForm = new FormGroup({
    cardholderName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    cardNumber: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(16), Validators.pattern(/^\d{1,16}$/)],
    }),
    expiryMonth: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])$/)],
    }),
    expiryYear: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(4), Validators.pattern(/^\d{1,4}$/)],
    }),
    cvc: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(3), Validators.pattern(/^\d{1,3}$/)],
    }),
  });

  getError(field: string, form: FormGroup) {
    return this.formValidator.getError(field, form)
  } 

  protected keepNumbersOnly(event: Event, controlName: NumericPaymentMethodControl, maxLength?: number): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '');
    const value = maxLength ? digits.slice(0, maxLength) : digits;

    input.value = value;
    this.paymentMethodForm.controls[controlName].setValue(value);
  }

  protected keepValidCardNumberSize(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.slice(0, 16);

    input.value = value;
    this.paymentMethodForm.controls.cardNumber.setValue(value);
  } 

  protected keepValidMonth(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 2);
    let value = digits;

    if (digits.length === 1 && Number(digits) > 1) {
      value = `0${digits}`;
    }

    if (digits.length === 2) {
      const month = Number(digits);

      if (month < 1) {
        value = '01';
      } else if (month > 12) {
        value = '12';
      } else {
        value = digits.padStart(2, '0');
      }
    }

    input.value = value;
    this.paymentMethodForm.controls.expiryMonth.setValue(value);
  }

  onSubmit() {
    if (this.paymentMethodForm.invalid) {
      this.paymentMethodForm.markAllAsTouched()
      console.log('Invalid form.')
      return
    }

    console.log(this.paymentMethodForm.value)
  }
}
