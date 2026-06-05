import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

type Profitability = 'High' | 'Medium';

interface InventoryProduct {
  readonly name: string;
  readonly stock: number;
  readonly wholesalePrice: string;
  readonly retailPrice: string;
  readonly margin: string;
  readonly profitability: Profitability;
}

@Component({
  selector: 'app-admin-dashboard-inventory-management',
  imports: [],
  templateUrl: './admin-dashboard-inventory-management.html',
  styleUrl: './admin-dashboard-inventory-management.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardInventoryManagement {
  readonly products = signal<readonly InventoryProduct[]>([
    {
      name: 'Classic T-Shirt',
      stock: 150,
      wholesalePrice: '$15.00',
      retailPrice: '$29.99',
      margin: '50.0%',
      profitability: 'Medium',
    },
    {
      name: 'Denim Jeans',
      stock: 85,
      wholesalePrice: '$45.00',
      retailPrice: '$79.99',
      margin: '43.7%',
      profitability: 'Medium',
    },
    {
      name: 'Running Shoes',
      stock: 42,
      wholesalePrice: '$70.00',
      retailPrice: '$129.99',
      margin: '46.1%',
      profitability: 'Medium',
    },
    {
      name: 'Leather Jacket',
      stock: 25,
      wholesalePrice: '$180.00',
      retailPrice: '$299.99',
      margin: '40.0%',
      profitability: 'Medium',
    },
    {
      name: 'Hoodie',
      stock: 120,
      wholesalePrice: '$30.00',
      retailPrice: '$59.99',
      margin: '50.0%',
      profitability: 'Medium',
    },
    {
      name: 'Sneakers',
      stock: 68,
      wholesalePrice: '$50.00',
      retailPrice: '$89.99',
      margin: '44.4%',
      profitability: 'Medium',
    },
    {
      name: 'Baseball Cap',
      stock: 200,
      wholesalePrice: '$12.00',
      retailPrice: '$24.99',
      margin: '52.0%',
      profitability: 'High',
    },
    {
      name: 'Backpack',
      stock: 55,
      wholesalePrice: '$38.00',
      retailPrice: '$69.99',
      margin: '45.7%',
      profitability: 'Medium',
    },
  ]);
}
