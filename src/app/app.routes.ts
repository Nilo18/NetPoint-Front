import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Signup } from './pages/signup/signup';
import { Login } from './pages/login/login';
import { ExpenseCalculator } from './pages/expense-calculator/expense-calculator';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';

export const routes: Routes = [
    {path: "", component: Home},
    {path: "signup", component: Signup},
    {path: "login", component: Login},
    {path: "expenses", component: ExpenseCalculator},
    {path: "admin", component: AdminDashboard},
];
