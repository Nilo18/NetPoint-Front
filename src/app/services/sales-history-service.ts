import { Injectable } from '@angular/core';

export interface SaleItem { readonly name: string; readonly quantity: number; readonly total: number; }
export interface SaleRecord { readonly id: number; readonly cashier: string; readonly completedAt: string; readonly revenue: number; readonly cost: number; readonly items: readonly SaleItem[]; }

@Injectable({ providedIn: 'root' })
export class SalesHistoryService {
  readonly sales: readonly SaleRecord[] = [
    { id: 1042, cashier: 'Maria Santos', completedAt: '2026-08-01T16:55:00+04:00', revenue: 219.97, cost: 115, items: [{ name: 'Premium Headphones', quantity: 1, total: 129.99 }, { name: 'USB-C Cable', quantity: 2, total: 49.98 }, { name: 'Phone Stand', quantity: 1, total: 40 }] },
    { id: 1041, cashier: 'Maria Santos', completedAt: '2026-08-01T16:00:00+04:00', revenue: 47, cost: 22, items: [{ name: 'Wireless Mouse', quantity: 1, total: 32 }, { name: 'Mouse Pad', quantity: 1, total: 15 }] },
    { id: 1040, cashier: 'Priya Nair', completedAt: '2026-08-01T11:00:00+04:00', revenue: 299.99, cost: 180, items: [{ name: 'Office Monitor', quantity: 1, total: 299.99 }] },
    { id: 1039, cashier: 'Maria Santos', completedAt: '2026-08-01T03:00:00+04:00', revenue: 189.97, cost: 98, items: [{ name: 'Mechanical Keyboard', quantity: 1, total: 109.99 }, { name: 'Desk Mat', quantity: 1, total: 39.99 }, { name: 'USB Hub', quantity: 1, total: 39.99 }] },
    { id: 1038, cashier: 'Priya Nair', completedAt: '2026-07-31T14:00:00+04:00', revenue: 359.97, cost: 200, items: [{ name: 'Webcam', quantity: 1, total: 119.99 }, { name: 'Studio Light', quantity: 1, total: 99.99 }, { name: 'Microphone', quantity: 1, total: 139.99 }] },
    { id: 1037, cashier: 'Omar Hassan', completedAt: '2026-07-30T10:30:00+04:00', revenue: 84.5, cost: 43.25, items: [{ name: 'Laptop Sleeve', quantity: 1, total: 44.5 }, { name: 'Travel Adapter', quantity: 1, total: 40 }] },
    { id: 1036, cashier: 'Priya Nair', completedAt: '2026-07-29T13:15:00+04:00', revenue: 499.99, cost: 310, items: [{ name: 'Ergonomic Chair', quantity: 1, total: 499.99 }] },
    { id: 1035, cashier: 'Omar Hassan', completedAt: '2026-07-28T09:20:00+04:00', revenue: 145.85, cost: 76.5, items: [{ name: 'Desk Organizer', quantity: 2, total: 55.9 }, { name: 'LED Lamp', quantity: 1, total: 89.95 }] },
    { id: 1034, cashier: 'Maria Santos', completedAt: '2026-07-27T15:40:00+04:00', revenue: 389.75, cost: 218, items: [{ name: 'Portable SSD', quantity: 1, total: 189.8 }, { name: 'Docking Station', quantity: 1, total: 199.95 }] },
    { id: 1033, cashier: 'Priya Nair', completedAt: '2026-07-26T12:05:00+04:00', revenue: 275.75, cost: 174, items: [{ name: 'Tablet Keyboard', quantity: 1, total: 125.8 }, { name: 'Stylus', quantity: 1, total: 79.95 }, { name: 'Tablet Case', quantity: 1, total: 70 }] },
  ];
}
