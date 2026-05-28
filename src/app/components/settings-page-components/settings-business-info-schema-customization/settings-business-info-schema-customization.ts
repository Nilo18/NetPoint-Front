import { Component } from '@angular/core';

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
})
export class SettingsBusinessInfoSchemaCustomization {
  attributes: Attribute[] = [
    { name: 'Name', typeLabel: 'Text field', type: 'Text' },
    { name: 'Price', typeLabel: 'Number field', type: 'Number' },
  ];
 
  addAttribute(): void {
    // Hook up your dialog / form logic here
    console.log('Add Attribute clicked');
  }
}
