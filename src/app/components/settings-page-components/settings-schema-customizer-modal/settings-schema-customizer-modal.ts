import { ChangeDetectionStrategy, Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingsPageService } from '../../../services/settings-page-service';
import { FormValidatorService } from '../../../services/form-validator-service';

export interface CustomAttribute {
  name: string;
  type: string;
}

@Component({
  selector: 'app-settings-schema-customizer-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './settings-schema-customizer-modal.html',
  styleUrl: './settings-schema-customizer-modal.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSchemaCustomizerModal {
  public modal = inject(NgbActiveModal);
  private formBuilder = inject(FormBuilder);
  private settingsService = inject(SettingsPageService)
  private formValidator = inject(FormValidatorService)

  fieldTypes = ['TEXT', 'NUMBER', 'DATE', 'BOOLEAN'];
  submitted = signal(false);
  gotBackendError = signal(false);
  errMsg = signal('');
  requestSent = signal(false);

  attributeForm!: FormGroup

  ngOnInit() {
    console.log('SettingsCustomizerModal is running')
    this.attributeForm = this.formBuilder.group({
      attributeName: ['', [Validators.required, Validators.maxLength(40)]],
      attributeType: ['TEXT', [Validators.required]],
    });
    console.log('SettingsCustomizerModal after initializing attributeForm')
  }

  async addAttribute() {
    if (this.requestSent()) {
      console.log('Request already sent')
      return
    }

    this.submitted.set(true);

    if (this.attributeForm.invalid) {
      this.attributeForm.markAllAsTouched();
      console.log('Invalid form.')
      return;
    }

    this.requestSent.set(true)
    this.gotBackendError.set(false)
    this.errMsg.set('')

    console.log(this.attributeForm.value)
    try {
      const res = await this.settingsService.addProductAttribute(this.attributeForm.value) 
      if (res) {
        this.requestSent.set(false)
        window.location.reload()
      }
    } catch (error: unknown) {
      this.requestSent.set(false)
      this.gotBackendError.set(true)
      this.errMsg.set(this.getBackendErrorMessage(error))
      console.log(error)
    }
  }

  getError(field: string, form: FormGroup) {
    return this.formValidator.getError(field, form)
  }

  private getBackendErrorMessage(error: unknown) {
    if (error instanceof HttpErrorResponse && typeof error.error?.error === 'string') {
      return error.error.error
    }

    return 'Something went wrong. Please try again.'
  }
}
