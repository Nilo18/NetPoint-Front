import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Signup } from './pages/signup/signup';
import { Login } from './pages/login/login';
import { ExpenseCalculator } from './pages/expense-calculator/expense-calculator';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { NotFoundPage } from './pages/not-found-page/not-found-page';
import { Settings } from './pages/settings/settings';

export const routes: Routes = [
    {path: "", component: Home},
    {path: "signup", component: Signup},
    {path: "login", component: Login},
    {path: "expenses", component: ExpenseCalculator},
    {path: "admin", component: AdminDashboard},
    {path: "settings", component: Settings},
    {path: "**", component: NotFoundPage}
];
