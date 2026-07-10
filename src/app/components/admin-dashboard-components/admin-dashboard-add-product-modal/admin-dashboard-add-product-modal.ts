import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, resource, signal, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomAttributeValue, ProductAttribute, ProductDTO, ProductService } from '../../../services/product-service';
import { FormValidatorService } from '../../../services/form-validator-service';
import { BackendErrorHandlerService } from '../../../services/backend-error-handler-service';

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
  protected readonly isSubmitting = signal(false);
  protected readonly backendError = signal<string | null>(null);
  protected readonly isDragged = signal<boolean>(false)
  customAttributes = resource<ProductAttribute[], unknown>({
    loader: () => this.productService.getArtificialProductAttributes(),
  });
  productToEdit: ProductDTO | null = null;
  initialFormValue: unknown | null = null;
  allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp']
  selectedFile = signal<File | null>(null)
  imagePreview = signal<string | null>(null)

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
          this.formBuilder.nonNullable.control(savedValue ?? defaultValue, Validators.required)
        )

        if (this.productToEdit && !this.initialFormValue) {
          this.initialFormValue = this.productForm.getRawValue();
        }
      })
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
    event.preventDefault()
    event.stopPropagation()
    this.isDragged.set(true)
  }

  onDrop(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.isDragged.set(false)

    const files = event.dataTransfer?.files
    if (files && files[0]) {
      this.processFile(files[0])
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement

    if (input.files && input.files[0]) {
      this.processFile(input.files[0])
      input.value = ''
    }
  }

  private processFile(file: File) {
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      alert('File size is too large')
      return
    }

    if (!this.allowedTypes.includes(file.type)) {
      alert('Invalid file format')
      return
    }

    this.selectedFile.set(file)

    const reader = new FileReader()
    reader.onload = () => {
      this.imagePreview.set(typeof reader.result === 'string' ? reader.result : null)
    }
    reader.readAsDataURL(file)
  }

  onDragLeave() {
    this.isDragged.set(false)
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

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>
  removePreview(event: MouseEvent) {
    event.stopPropagation()
    this.imagePreview.set(null)
    this.selectedFile.set(null)

    if (this.fileInput) {
      this.fileInput.nativeElement.value = ''
    }
  }

  protected getSubmitLabel() {
    if (this.isSubmitting()) {
      return this.productToEdit ? 'Saving changes...' : 'Adding product...';
    }

    return this.productToEdit ? 'Edit Product' : 'Add Product';
  }

}
