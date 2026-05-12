import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-expense-calculator',
  imports: [],
  templateUrl: './expense-calculator.html',
  styleUrl: './expense-calculator.scss',
})
export class ExpenseCalculator {
  public authService = inject(AuthService)
}
