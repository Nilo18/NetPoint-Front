import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CustomAttribute,
  SettingsSchemaCustomizerModal,
} from '../settings-schema-customizer-modal/settings-schema-customizer-modal';

interface Attribute {
  name: string;
  typeLabel: string;
  type: string;
}

@Component({
  selector: 'app-settings-business-info-schema-customization',
  imports: [],
  templateUrl: './settings-business-info-schema-customization.html',
  styleUrl: './settings-business-info-schema-customization.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsBusinessInfoSchemaCustomization {
  private modal = inject(NgbModal);

  attributes = signal<Attribute[]>([
    { name: 'Name', typeLabel: 'Text field', type: 'Text' },
    { name: 'Price', typeLabel: 'Number field', type: 'Number' },
  ]);
 
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
}
