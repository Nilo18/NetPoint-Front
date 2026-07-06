import { ChangeDetectionStrategy, Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductAttribute, ProductService } from '../../../services/product-service';
import { BackendErrorHandlerService } from '../../../services/backend-error-handler-service';

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
  private productService = inject(ProductService);
  private backendErrorHandler = inject(BackendErrorHandlerService);

  fieldTypes = ['TEXT', 'NUMBER', 'DATE', 'BOOLEAN'];
  submitted = signal(false);
  gotBackendError = signal(false);
  errMsg = signal('');
  requestSent = signal(false);

  defaultAttribute: ProductAttribute | null = null;
  attributeForm!: FormGroup

  ngOnInit() {
    console.log('SettingsCustomizerModal is running')
    this.attributeForm = this.formBuilder.group({
      id: [this.defaultAttribute?.id ?? ''],
      attributeName: [this.defaultAttribute?.attributeName ?? '', [Validators.required, Validators.maxLength(40)]],
      attributeType: [this.defaultAttribute?.attributeType ?? 'TEXT', [Validators.required]],
      isDefault: [false, [Validators.required]]
    });
    console.log('SettingsCustomizerModal after initializing attributeForm')
  }

  setDefaultAttribute(attribute: ProductAttribute): void {
    this.defaultAttribute = attribute;
    this.attributeForm?.patchValue({
      attributeName: attribute.attributeName,
      attributeType: attribute.attributeType,
    });
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
      const res = await this.productService.addProductAttribute(this.attributeForm.value);
      if (res) {
        this.requestSent.set(false)
        window.location.reload()
      }
    } catch (error: unknown) {
      this.requestSent.set(false)
      this.gotBackendError.set(true)
      this.errMsg.set(this.backendErrorHandler.getErrorMessage(error, 'Something went wrong. Please try again.'))
      console.log(error)
    }
  }

  async updateAttribute() {
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

    const formValue = this.attributeForm.getRawValue();

    const hasNotChanged =
      this.defaultAttribute &&
      formValue.attributeName === this.defaultAttribute.attributeName &&
      formValue.attributeType === this.defaultAttribute.attributeType;

    if (hasNotChanged) {
      console.log('Attribute value has not changed, avoiding request.')
      return;
    }

    this.requestSent.set(true)
    this.gotBackendError.set(false)
    this.errMsg.set('')

    console.log(this.attributeForm.value)
    try {
      const res = await this.productService.updateProductAttribute(this.attributeForm.value);
      if (res) {
        this.requestSent.set(false)
        window.location.reload()
      }
    } catch (error: unknown) {
      this.requestSent.set(false)
      this.gotBackendError.set(true)
      this.errMsg.set(this.backendErrorHandler.getErrorMessage(error, 'Something went wrong. Please try again.'))
      console.log(error)
    }
  }

  onSubmit() {
    if (!this.defaultAttribute) {
      this.addAttribute()
    } else {
      this.updateAttribute()
    }
  }

}
