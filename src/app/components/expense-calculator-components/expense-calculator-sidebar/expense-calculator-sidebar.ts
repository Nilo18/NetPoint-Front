import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { ProductDTO } from '../../../services/product-service';
import { CheckoutRequestItem, CheckoutService } from '../../../services/checkout-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteRequestErrorDisplayModal } from '../../delete-request-error-display-modal/delete-request-error-display-modal';
import { BackendErrorHandlerService } from '../../../services/backend-error-handler-service';

@Component({
  selector: 'app-expense-calculator-sidebar',
  imports: [],
  templateUrl: './expense-calculator-sidebar.html',
  styleUrl: './expense-calculator-sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseCalculatorSidebar {
  private checkoutService = inject(CheckoutService)
  private modalService = inject(NgbModal)
  private backendErrorHandler = inject(BackendErrorHandlerService)
  cartItems = input.required<ProductDTO[] | null>()
  isCheckingOut = signal(false)
  checkoutError = signal('')
  isCheckoutDisabled = computed(() => this.isCheckingOut() || (this.cartItems()?.length ?? 0) === 0)
  total = computed(() => {
    let sum = 0
    this.cartItems()?.forEach(item => {
      sum += ((item.quantity ?? 1) * item.retailPrice)
    })
    return sum.toFixed(2)
  })
  increaseQuantity = output<number>();
  decreaseQuantity = output<number>();
  removeItem = output<number>();

  async checkout() {
    if (this.isCheckoutDisabled()) {
      console.log('Cart is empty.')
      return
    }

    this.isCheckingOut.set(true)
    this.checkoutError.set('')

    const checkoutItems: CheckoutRequestItem[] = (this.cartItems() ?? []).map(cartItem => ({
      productId: cartItem.id,
      quantity: cartItem.quantity ?? 1
    }))
    
    try {
      const res = await this.checkoutService.checkout(checkoutItems)

      if (res) {
        window.location.reload()
      }
    } catch (error: unknown) {
      const errorMessage = this.backendErrorHandler.getErrorMessage(
        error,
        'We could not complete the sale. Please try again.',
      )
      this.checkoutError.set(errorMessage)
      const modalRef = this.modalService.open(DeleteRequestErrorDisplayModal, {
        centered: true
      })

      modalRef.componentInstance.errTitle = 'An Error Occured While Trying To Complete Transaction'
      modalRef.componentInstance.errMsg = errorMessage
    } finally {
      this.isCheckingOut.set(false)
    }
  }

  roundNumber(num: number, digit: number) {
    return num.toFixed(digit)
  }
}
