import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, resource, signal, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomAttributeValue, ProductAttribute, ProductDTO, ProductService } from '../../../services/product-service';
import { FormValidatorService } from '../../../services/form-validator-service';
import { BackendErrorHandlerService } from '../../../services/backend-error-handler-service';
import { ImageUploadProcessorService } from '../../../services/image-upload-processor-service';

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
  private backendErrorHandler = inject(BackendErrorHandlerService);
  private imageUploadProcessor = inject(ImageUploadProcessorService);
  protected readonly isSubmitting = signal(false);
  protected readonly backendError = signal<string | null>(null);
  protected readonly isDragged = signal<boolean>(false)
  customAttributes = resource<ProductAttribute[], unknown>({
    loader: () => this.productService.getArtificialProductAttributes(),
  });
  productToEdit: ProductDTO | null = null;
  initialFormValue: unknown | null = null;
  selectedFile = signal<File | null>(null)
  imagePreview = signal<string | null>(null)
  imageError = signal('')

  constructor() {
    effect(() => {
      // if (this.productToEdit) return
      const attrs = this.customAttributes.value()
      if (!attrs) return

      attrs.forEach(attr => {
        if (this.productForm.contains(attr.attributeName)) return

        const savedValue = this.productToEdit?.customAttributes?.[attr.attributeName]
        const defaultValue = attr.attributeType.trim().toLowerCase() === 'boolean' ? true : ''

        this.productForm.addControl(
          attr.attributeName,
          this.formBuilder.nonNullable.control(
            savedValue ?? defaultValue,
            this.getCustomAttributeValidators(attr.attributeType),
          )
        )

      })

      if (this.productToEdit && !this.initialFormValue) {
        this.initialFormValue = this.productForm.getRawValue();
      }
    })
  }

  ngOnInit() {
    if (!this.productToEdit) {
      return
    }

    console.log(this.productToEdit)
    if (this.productToEdit.imageUrl) {
      this.imagePreview.set(this.productToEdit.imageUrl)
    }
    this.productForm.patchValue({
      name: this.productToEdit.name,
      retailPrice: this.productToEdit.retailPrice,
      wholesalePrice: this.productToEdit.wholesalePrice,
      stock: this.productToEdit.stock,
    });
  }

  readonly productForm = this.formBuilder.nonNullable.group<{[key: string]: AbstractControl}>({
    imageUrl: this.formBuilder.nonNullable.control(''),
    name: this.formBuilder.nonNullable.control('', Validators.required),
    retailPrice: this.formBuilder.nonNullable.control('', [Validators.required, Validators.min(0), 
      Validators.max(100000000)]),
    wholesalePrice: this.formBuilder.nonNullable.control('', [Validators.required, Validators.min(0), 
      Validators.max(100000000)]),
    stock: this.formBuilder.nonNullable.control('', [Validators.required, Validators.min(1), 
      Validators.max(1000000)]),
  });

  onDragOver(event: DragEvent) {
    this.imageUploadProcessor.onDragOver(event, this.isDragged)
  }

  onDrop(event: DragEvent) {
    this.imageUploadProcessor.onDrop(event, this.imageUploadState)
  }

  onFileSelected(event: Event) {
    this.imageUploadProcessor.onFileSelected(event, this.imageUploadState)
  }

  onDragLeave() {
    this.imageUploadProcessor.onDragLeave(undefined, this.isDragged)
  }

  async addProduct() {
    console.log(this.productForm.getRawValue());
    // console.log('wholesalePrice:', wholesalePrice);
    const payload = this.formatPayload()
    for (const [key, value] of payload.entries()) {
      console.log(key, value)
    }

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      console.log('Invalid form.')
      return;
    }

    try {
      this.isSubmitting.set(true);
      this.backendError.set(null);
      const res = await this.productService.addProduct(payload)
      if (res) {
        window.location.reload();
      }
    } catch (error) {
      this.backendError.set(this.backendErrorHandler.getErrorMessage(error, 'We could not add this product. Please try again.'));
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
      console.log('Invalid form.')
      return;
    }

    const formValueChanged =
      JSON.stringify(this.productForm.getRawValue()) !== JSON.stringify(this.initialFormValue)
    const imageChanged =
      this.selectedFile() !== null ||
      this.imagePreview() !== (this.productToEdit.imageUrl ?? null)

    if (!formValueChanged && !imageChanged) {
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
      this.backendError.set(this.backendErrorHandler.getErrorMessage(error, 'We could not update this product. Please try again.'));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private formatPayload() {
    const { imageUrl, name, retailPrice, wholesalePrice, stock, ...dynamicAttrs } = this.productForm.getRawValue();

    const customAttributes: Record<string, CustomAttributeValue> = {};
    Object.entries(dynamicAttrs).forEach(([key, value]) => {
      customAttributes[key] = value;
    });

    const formData = new FormData()

    formData.append('name', name);
    formData.append('retailPrice', String(retailPrice));
    formData.append('wholesalePrice', wholesalePrice == null ? '' : String(wholesalePrice));
    formData.append('stock', String(stock));
    formData.append('customAttributesJson', JSON.stringify(customAttributes));

    if (this.productToEdit) {
      const removeImage = Boolean(
        this.productToEdit.imageUrl && !this.imagePreview() && !this.selectedFile()
      )
      if (removeImage) {
        formData.append('removeImage', 'true');
      }
    }

    const file = this.selectedFile();
    if (file) {
      formData.append('image', file);
    }
    return formData;
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

  getCustomAttributeError(attribute: ProductAttribute): string {
    const control = this.productForm.get(attribute.attributeName)

    if (!control?.touched) return ''
    if (control.hasError('required') || control.hasError('whitespace')) {
      return `${attribute.attributeName} is required.`
    }
    if (control.hasError('maxlength')) {
      return `${attribute.attributeName} must be at most 255 characters long.`
    }
    if (control.hasError('invalidNumber')) {
      return `${attribute.attributeName} must be a valid number.`
    }
    if (control.hasError('invalidDate')) {
      return `${attribute.attributeName} must be a valid date.`
    }

    return ''
  }

  private getCustomAttributeValidators(attributeType: string): ValidatorFn[] {
    const type = attributeType.trim().toLowerCase()

    if (type === 'boolean') {
      return [Validators.required]
    }
    if (type === 'number') {
      return [Validators.required, this.formValidator.finiteNumberValidator]
    }
    if (type === 'date') {
      return [Validators.required, this.formValidator.validDateValidator]
    }

    return [Validators.required, Validators.maxLength(255), this.formValidator.nonWhitespaceValidator]
  }

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>
  removePreview(event: MouseEvent) {
    this.imageUploadProcessor.removeImage(event, this.imageUploadState, this.fileInput?.nativeElement)
  }

  private get imageUploadState() {
    return {
      isDragged: this.isDragged,
      selectedFile: this.selectedFile,
      preview: this.imagePreview,
      error: this.imageError,
    }
  }

  protected getSubmitLabel() {
    if (this.isSubmitting()) {
      return this.productToEdit ? 'Saving changes...' : 'Adding product...';
    }

    return this.productToEdit ? 'Edit Product' : 'Add Product';
  }

}
