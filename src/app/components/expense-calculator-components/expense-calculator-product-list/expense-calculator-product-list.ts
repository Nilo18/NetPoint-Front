import { ChangeDetectionStrategy, Component } from '@angular/core';

interface ExpenseCalculatorProduct {
  name: string;
  price: string;
  stock: number;
}

@Component({
  selector: 'app-expense-calculator-product-list',
  imports: [],
  templateUrl: './expense-calculator-product-list.html',
  styleUrl: './expense-calculator-product-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseCalculatorProductList {
  protected readonly products: ExpenseCalculatorProduct[] = [
    {
      name: 'Classic T-Shirt',
      price: '$29.99',
      stock: 150,
    },
    {
      name: 'Denim Jeans',
      price: '$79.99',
      stock: 85,
    },
    {
      name: 'Running Shoes',
      price: '$129.99',
      stock: 42,
    },
    {
      name: 'Leather Jacket',
      price: '$299.99',
      stock: 25,
    },
    {
      name: 'Hoodie',
      price: '$59.99',
      stock: 120,
    },
    {
      name: 'Sneakers',
      price: '$89.99',
      stock: 68,
    },
    {
      name: 'Baseball Cap',
      price: '$24.99',
      stock: 200,
    },
    {
      name: 'Backpack',
      price: '$69.99',
      stock: 55,
    }
  ];
}
