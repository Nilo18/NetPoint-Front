import { Component, computed, output, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pricing-page-heading',
  imports: [FormsModule],
  templateUrl: './pricing-page-heading.html',
  styleUrl: './pricing-page-heading.scss',
})
export class PricingPageHeading {
  inputValue: WritableSignal<string> = signal('Monthly')
  // isToggleChecked = computed(() => {

  // })
  priceModeChange = output<string>()

  changePriceMode(value: string) {
    this.inputValue.set(value)
    console.log('The inputValue is: ', this.inputValue())
    this.priceModeChange.emit(this.inputValue())
  }
}
