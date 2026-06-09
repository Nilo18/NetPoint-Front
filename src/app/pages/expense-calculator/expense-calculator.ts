import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { AdminDashboardHeader } from '../../components/admin-dashboard-components/admin-dashboard-header/admin-dashboard-header';
import { TokenService } from '../../services/token-service';
import { ExpenseCalculatorProductList } from '../../components/expense-calculator-components/expense-calculator-product-list/expense-calculator-product-list';
import { ExpenseCalculatorSidebar } from '../../components/expense-calculator-components/expense-calculator-sidebar/expense-calculator-sidebar';

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

  ngOnInit() {
    console.log(this.tokenService.getDecodedToken())
  }
}
