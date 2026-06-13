import { ChangeDetectionStrategy, Component, computed, effect, inject, resource, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomAttributeValue, ProductAttribute, ProductDTO, ProductService } from '../../../services/product-service';

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
  private productService = inject(ProductService);
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
        this.productForm.addControl(
          attr.attributeName,
          this.formBuilder.nonNullable.control(attr.attributeType.trim().toLowerCase() === 'boolean' ? true : '',
          Validators.required)
        )
      })
    })
  }

  ngOnInit() {
    console.log(this.customAttributes.value())
    console.log("Product to edit is: ", this.productToEdit)
    if (!this.productToEdit) {
      return
    }

    console.log("Product to edit is: ", this.productToEdit.name)
    this.productForm.patchValue({
      name: this.productToEdit.name,
      retailPrice: this.productToEdit.retailPrice,
      wholesalePrice: this.productToEdit.wholesalePrice,
      stock: this.productToEdit.stock,
    });

    const attrs = this.productToEdit.customAttributes
    console.log('attrs are: ', attrs)

    if (attrs) {
      Object.entries(attrs).forEach(([key, value]) => {
        this.productForm.addControl(
          key,
          this.formBuilder.nonNullable.control(value, Validators.required)
        )
      })

      this.initialFormValue = this.productForm.getRawValue()
    }
  }

  readonly productForm = this.formBuilder.nonNullable.group<{[key: string]: AbstractControl}>({
    name: this.formBuilder.nonNullable.control('', Validators.required),
    retailPrice: this.formBuilder.nonNullable.control('', Validators.required),
    wholesalePrice: this.formBuilder.nonNullable.control('', Validators.required),
    stock: this.formBuilder.nonNullable.control('', Validators.required),
  });

  async addProduct() {
    if (this.productForm.invalid) {
      console.log('Invalid form: ', this.productForm.value)
      this.productForm.markAllAsTouched();
      return;
    }

    const payload = this.formatPayload()
    console.log(payload);

    try {
      const res = await this.productService.addProduct(payload)
      
      if (res) {
        window.location.reload()
      }
    } catch (error) {
      console.log(error)
    }
  }

  async editProduct() {
    if (!this.productToEdit) {
      return
    }

    if (this.productForm.invalid) {
      console.log('Invalid form: ', this.productForm.value)
      this.productForm.markAllAsTouched();
      return;
    }

    if (JSON.stringify(this.productForm.getRawValue()) === JSON.stringify(this.initialFormValue)) {
      console.log("Form value has not changed.")
      return
    }

    const payload = this.formatPayload()
    console.log(payload);
    try {
      const res = await this.productService.editProduct(this.productToEdit.id, payload)

      if (res) {
        window.location.reload()
      }
    } catch (error) {
      console.log(error)
    }
  }

  private formatPayload() {
    console.log(this.productForm.value)
    const { name, retailPrice, wholesalePrice, stock, ...dynamicAttrs } = this.productForm.value;

    const customAttributes: Record<string, CustomAttributeValue> = {};
    Object.entries(dynamicAttrs).forEach(([key, value]) => {
      customAttributes[key] = value;
    });

    return { name, retailPrice, wholesalePrice, stock, customAttributes };
  }

  onSubmit() {
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
}
