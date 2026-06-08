import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormValidatorService } from '../../../services/form-validator-service';
import { PaymentMethod, PaymentMethodCredentials, SettingsPageService } from '../../../services/settings-page-service';

type NumericPaymentMethodControl = 'cardNumber' | 'expYear' | 'cvc';

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
  passedPaymentMethod!: PaymentMethod

  ngOnInit() {
    if (this.passedPaymentMethod) {
      this.paymentMethodForm.patchValue({
        cardholderName: this.passedPaymentMethod.cardholderName || '',
        expMonth: String(this.passedPaymentMethod.cardExpMonth) || '',
        expYear: String(this.passedPaymentMethod.cardExpYear) || ''
      });
    }
  }

  protected readonly paymentMethodForm = new FormGroup({
    cardholderName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    cardNumber: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(16), Validators.pattern(/^\d{1,16}$/)],
    }),
    expMonth: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, /*Validators.pattern(/^(0[1-9]|1[0-2])$/)*/],
    }),
    expYear: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), Validators.pattern(/^\d{1,4}$/)],
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
    this.paymentMethodForm.controls.expMonth.setValue(value);
  }

  protected normalizeMonthOnBlur(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 2);

    if (!digits) {
      input.value = '';
      return;
    }

    const month = Number(digits);

    if (month < 1) {
      input.value = '01';
    } else if (month > 12) {
      input.value = '12';
    } else {
      input.value = digits.padStart(2, '0');
    }
  }

  isFormValid() {
    if (this.paymentMethodForm.invalid) {
      this.paymentMethodForm.markAllAsTouched()
      console.log('Invalid form.')
      return false
    }
    return true
  }

  async addPaymentMethod() {
    if (!this.isFormValid()) return

    console.log(this.paymentMethodForm.value)
    const raw = this.paymentMethodForm.getRawValue()

    const res = await this.settingsService.addPaymentMethod(
      {
        ...raw,
        expMonth: Number(raw.expMonth),
        expYear: Number(raw.expYear)
      }
    )

    if (res) {
      window.location.reload()
    }
  }

  async updatePaymentMethod() {
    if (!this.isFormValid()) return

    console.log(this.paymentMethodForm.value)
    const raw = this.paymentMethodForm.getRawValue()

    const res = await this.settingsService.updatePaymentMethod(
      {
        ...raw,
        expMonth: Number(raw.expMonth),
        expYear: Number(raw.expYear)
      }
    )

    if (res) {
      window.location.reload()
    }
  }

  onSubmit() {
    let res
    if (this.passedPaymentMethod) {
      this.updatePaymentMethod()
    } else {
      this.addPaymentMethod()
    }
    
  }
}
