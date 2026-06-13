import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, effect, inject, resource, signal, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomAttributeValue, ProductAttribute, ProductDTO, ProductService } from '../../../services/product-service';
import { FormValidatorService } from '../../../services/form-validator-service';

@Component({
  selector: 'app-admin-dashboard-add-product-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-dashboard-add-product-modal.html',
  styleUrl: './admin-dashboard-add-product-modal.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardAddProductModal {
  readonly modal = inject(NgbActiveModal);
  private readonly formBuilder = inject(FormBuilder);
  public formValidator = inject(FormValidatorService);
  private productService = inject(ProductService);
  protected readonly isSubmitting = signal(false);
  protected readonly backendError = signal<string | null>(null);
  customAttributes = resource<ProductAttribute[], unknown>({
    loader: () => this.productService.getArtificialProductAttributes(),
  });
  productToEdit: ProductDTO | null = null;
  initialFormValue: unknown | null = null;

  constructor() {
    effect(() => {
      if (this.productToEdit) return
      const attrs = this.customAttributes.value()
      if (!attrs) return
      
      attrs.forEach(attr => {
        if (this.productForm.contains(attr.attributeName)) return

        this.productForm.addControl(
          attr.attributeName,
          this.formBuilder.nonNullable.control(attr.attributeType.trim().toLowerCase() === 'boolean' ? true : '',
          Validators.required)
        )
      })
    })
  }

  ngOnInit() {
    if (!this.productToEdit) {
      return
    }

    this.productForm.patchValue({
      name: this.productToEdit.name,
      retailPrice: this.productToEdit.retailPrice,
      wholesalePrice: this.productToEdit.wholesalePrice,
      stock: this.productToEdit.stock,
    });

    const attrs = this.productToEdit.customAttributes

    if (attrs) {
      Object.entries(attrs).forEach(([key, value]) => {
        if (this.productForm.contains(key)) {
          this.productForm.get(key)?.setValue(value)
          return
        }

        this.productForm.addControl(
          key,
          this.formBuilder.nonNullable.control(value, Validators.required)
        )
      })
    }

    this.initialFormValue = this.productForm.getRawValue()
  }

  readonly productForm = this.formBuilder.nonNullable.group<{[key: string]: AbstractControl}>({
    name: this.formBuilder.nonNullable.control('', Validators.required),
    retailPrice: this.formBuilder.nonNullable.control('', [Validators.required, Validators.min(0), 
      Validators.max(100000000)]),
    wholesalePrice: this.formBuilder.nonNullable.control('', [Validators.required, Validators.min(0), 
      Validators.max(100000000)]),
    stock: this.formBuilder.nonNullable.control('', [Validators.required, Validators.min(1), 
      Validators.max(1000000)]),
  });

  async addProduct() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      console.log('Invalid form.')
      return;
    }

    const payload = this.formatPayload()

    try {
      this.isSubmitting.set(true);
      this.backendError.set(null);
      const res = await this.productService.addProduct(payload)
      if (res) {
        window.location.reload();
      }
    } catch (error) {
      this.backendError.set(this.getErrorMessage(error, 'We could not add this product. Please try again.'));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async editProduct() {
    if (!this.productToEdit) {
      return
    }

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    if (JSON.stringify(this.productForm.getRawValue()) === JSON.stringify(this.initialFormValue)) {
      console.log("Form value has not changed.")
      return
    }

    const payload = this.formatPayload()
    try {
      this.isSubmitting.set(true);
      this.backendError.set(null);
      const res = await this.productService.editProduct(this.productToEdit.id, payload)
      if (res) {
        window.location.reload();
      }
    } catch (error) {
      this.backendError.set(this.getErrorMessage(error, 'We could not update this product. Please try again.'));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private formatPayload() {
    const { name, retailPrice, wholesalePrice, stock, ...dynamicAttrs } = this.productForm.getRawValue();

    const customAttributes: Record<string, CustomAttributeValue> = {};
    Object.entries(dynamicAttrs).forEach(([key, value]) => {
      customAttributes[key] = value;
    });

    return { name, retailPrice, wholesalePrice, stock, customAttributes };
  }

  onSubmit() {
    console.log('I run')
    if (this.isSubmitting()) {
      return;
    }

    if (this.productToEdit) {
      this.editProduct()
    } else {
      this.addProduct()
    }
  }

  isInputTypeBoolean(attributeType: string) {
    const stdAttributeType = attributeType.trim().toLowerCase()

    return stdAttributeType === 'boolean'
  }

  protected getSubmitLabel() {
    if (this.isSubmitting()) {
      return this.productToEdit ? 'Saving changes...' : 'Adding product...';
    }

    return this.productToEdit ? 'Edit Product' : 'Add Product';
  }

  private getErrorMessage(error: unknown, fallbackMessage: string) {
    if (error instanceof HttpErrorResponse) {
      const backendMessage = this.extractBackendMessage(error.error);

      return backendMessage || error.message || fallbackMessage;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return fallbackMessage;
  }

  private extractBackendMessage(errorBody: unknown): string | null {
    if (typeof errorBody === 'string') {
      return errorBody;
    }

    if (!errorBody || typeof errorBody !== 'object') {
      return null;
    }

    if ('message' in errorBody && typeof errorBody.message === 'string') {
      return errorBody.message;
    }

    if ('error' in errorBody && typeof errorBody.error === 'string') {
      return errorBody.error;
    }

    if ('title' in errorBody && typeof errorBody.title === 'string') {
      return errorBody.title;
    }

    return null;
  }
}
