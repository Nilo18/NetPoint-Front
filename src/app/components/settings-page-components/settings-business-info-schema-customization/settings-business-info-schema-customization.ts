import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CustomAttribute,
  SettingsSchemaCustomizerModal,
} from '../settings-schema-customizer-modal/settings-schema-customizer-modal';
import { ProductAttribute, ProductService } from '../../../services/product-service';
import { BackendErrorOverlay } from '../../backend-error-overlay/backend-error-overlay';
import { DeleteRequestErrorDisplayModal } from '../../delete-request-error-display-modal/delete-request-error-display-modal';
import { BackendErrorHandlerService } from '../../../services/backend-error-handler-service';

interface Attribute {
  name: string;
  typeLabel: string;
  type: string;
}

@Component({
  selector: 'app-settings-business-info-schema-customization',
  imports: [BackendErrorOverlay],
  templateUrl: './settings-business-info-schema-customization.html',
  styleUrl: './settings-business-info-schema-customization.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsBusinessInfoSchemaCustomization {
  private modal = inject(NgbModal);
  private productService = inject(ProductService);
  private backendErrorHandler = inject(BackendErrorHandlerService);
  attributes = signal<ProductAttribute[]>([]);
  isLoading = signal(true)
  gotBackendError = signal(false)
  gotSearchError = signal(false)
  backendErrMsg = signal('')
  deletingAttributeId = signal<number | null>(null)
 
  async ngOnInit() {
    this.isLoading.set(true)
    this.gotBackendError.set(false)
    this.backendErrMsg.set('')

    try {
      const res = await this.productService.getProductAttributes();
      this.attributes.set(res)
    } catch (error: unknown) {
      this.gotBackendError.set(true)
      this.backendErrMsg.set(this.backendErrorHandler.getErrorMessage(
        error,
        'Unable to process the request. Please try again.',
      ))
    } finally {
      this.isLoading.set(false)
    }
  }

  open(): void {
    console.log('open() is running')
    const modalRef = this.modal.open(SettingsSchemaCustomizerModal, {
      centered: true,
    });
    console.log('open() after creating modalRef')
    // modalRef.closed.subscribe((attribute: CustomAttribute) => {
    //   this.attributes.update((attributes) => [
    //     ...attributes,
    //     {
    //       name: attribute.name,
    //       type: attribute.type,
    //       typeLabel: `${attribute.type} field`,
    //     },
    //   ]);
    // });
  }

  openWithAttribute(attribute: ProductAttribute): void {
    const modalRef = this.modal.open(SettingsSchemaCustomizerModal, {
      centered: true,
    });

    modalRef.componentInstance.setDefaultAttribute(attribute);
  }

  async deleteAttribute(id: number | undefined) {
    if (!id) {
      console.log('Undefined id')
      return
    }

    this.deletingAttributeId.set(id)
    this.backendErrMsg.set('')

    try {
      await this.productService.deleteProductAttributes(id);
      this.attributes.update(values => values.filter(attribute => attribute.id !== id))
    } catch (error: unknown) {
      const errorMsg = this.backendErrorHandler.getErrorMessage(
        error,
        'Unable to process the request. Please try again.',
      )
      const modalRef = this.modal.open(DeleteRequestErrorDisplayModal, {
        centered: true
      })

      this.backendErrMsg.set(errorMsg)
      modalRef.componentInstance.errTitle = 'Attribute deletion failed'
      modalRef.componentInstance.errMsg = errorMsg
    } finally {
      this.deletingAttributeId.set(null)
    }
  }

}
