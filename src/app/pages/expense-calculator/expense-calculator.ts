import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { AdminDashboardHeader } from '../../components/admin-dashboard-components/admin-dashboard-header/admin-dashboard-header';
import { TokenService } from '../../services/token-service';
import { ExpenseCalculatorProductList } from '../../components/expense-calculator-components/expense-calculator-product-list/expense-calculator-product-list';
import { ExpenseCalculatorSidebar } from '../../components/expense-calculator-components/expense-calculator-sidebar/expense-calculator-sidebar';
import { ProductDTO } from '../../services/product-service';
import { AdminDashboardSearchBar } from '../../components/admin-dashboard-components/admin-dashboard-search-bar/admin-dashboard-search-bar';

@Component({
  selector: 'app-expense-calculator',
  imports: [AdminDashboardHeader, ExpenseCalculatorProductList, ExpenseCalculatorSidebar],
  templateUrl: './expense-calculator.html',
  styleUrl: './expense-calculator.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseCalculator {
  public authService = inject(AuthService)
  private tokenService = inject(TokenService)
  cart = signal<ProductDTO[]>([]);

  ngOnInit() {
    console.log(this.tokenService.getDecodedToken())
  }

  handleCartAddition(product: ProductDTO) {
    console.log(product)
    const quantityToAdd = product.quantity ?? 1
    const existingProduct = this.cart().find(prod => prod.id === product.id)
    // console.log("Product stock is: ", existingProduct?.stock)

    if (existingProduct) {
      // existingProduct.quantity!++
      this.cart.update(currentCart => 
      currentCart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: (item.quantity || 0) + quantityToAdd, stock: product.stock }
          : item
        )
      );
      console.log("Product was found in cart, increasing quantity instead: ", existingProduct)
      return
    }

    const newProduct = { ...product, quantity: quantityToAdd };
    this.cart.update(currentCart => ([...currentCart, newProduct]))
    console.log("Product added to cart: ", this.cart())
  }

  increaseCartItemQuantity(productId: number, stockWasReserved: boolean) {
    if (!stockWasReserved) {
      return;
    }

    this.cart.update(currentCart =>
      currentCart.map(item =>
        item.id === productId
          ? {
              ...item,
              quantity: (item.quantity || 0) + 1,
              stock: Math.max(item.stock - 1, 0)
            }
          : item
      )
    );
  }

  decreaseCartItemQuantity(productId: number) {
    this.cart.update(currentCart =>
      currentCart
        .map(item =>
          item.id === productId
            ? {
                ...item,
                quantity: Math.max((item.quantity || 1) - 1, 0),
                stock: item.stock + 1
              }
            : item
        )
        .filter(item => (item.quantity || 0) > 0)
    );
  }

  removeCartItem(productId: number) {
    this.cart.update(currentCart => currentCart.filter(item => item.id !== productId));
  }

  getCartItemQuantity(productId: number) {
    return this.cart().find(item => item.id === productId)?.quantity ?? 0;
  }
}
