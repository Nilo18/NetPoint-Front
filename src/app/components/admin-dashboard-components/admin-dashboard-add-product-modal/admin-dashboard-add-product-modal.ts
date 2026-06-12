import { ChangeDetectionStrategy, Component, computed, effect, inject, resource, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductAttribute, ProductService } from '../../../services/product-service';

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

  constructor() {
    effect(() => {
      const attrs = this.customAttributes.value()
      if (attrs) {
        attrs.forEach(attr => {
          this.productForm.addControl(
            attr.attributeName,
            this.formBuilder.nonNullable.control(attr.attributeType.trim().toLowerCase() === 'boolean' ? true : '',
            Validators.required)
          )
        })
      }
    })
  }

  ngOnInit() {
    console.log(this.customAttributes.value())
  }

  readonly sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

  readonly productForm = this.formBuilder.nonNullable.group<{[key: string]: AbstractControl}>({
    name: this.formBuilder.nonNullable.control('', Validators.required),
    retailPrice: this.formBuilder.nonNullable.control('', Validators.required),
    wholesalePrice: this.formBuilder.nonNullable.control('', Validators.required),
    stock: this.formBuilder.nonNullable.control('', Validators.required),
  });

  onSubmit(): void {
    if (this.productForm.invalid) {
      console.log('Invalid form: ', this.productForm.value)
      this.productForm.markAllAsTouched();
      return;
    }

    const { name, retailPrice, wholesalePrice, stock, ...dynamicAttrs } = this.productForm.value;

    const customAttributes: Record<string, string> = {};
    Object.entries(dynamicAttrs).forEach(([key, value]) => {
      customAttributes[key] = String(value);
    });

    const payload = { name, retailPrice, wholesalePrice, stock, customAttributes };
    console.log(payload);
    this.productService.addProduct(payload)
    // this.modal.close(this.productForm.getRawValue());
  }

  isInputTypeBoolean(attributeType: string) {
    const stdAttributeType = attributeType.trim().toLowerCase()

    return stdAttributeType === 'boolean'
  }
}
