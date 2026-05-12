import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Signup } from './pages/signup/signup';
import { Login } from './pages/login/login';
import { ExpenseCalculator } from './pages/expense-calculator/expense-calculator';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { NotFoundPage } from './pages/not-found-page/not-found-page';
import { Settings } from './pages/settings/settings';
import { UserInviteTokenValidation } from './pages/user-invite-token-validation/user-invite-token-validation';
import { adminDashboardGuard } from './guards/admin-dashboard-guard';

export const routes: Routes = [
    {path: "", component: Home},
    {path: "signup", component: Signup},
    {path: "login", component: Login},
    {path: "expenses", component: ExpenseCalculator},
    {path: "admin", component: AdminDashboard, canActivate: [adminDashboardGuard]},
    {path: "settings", component: Settings},
    {path: "setup-account", component: UserInviteTokenValidation},
    {path: "**", component: NotFoundPage}
];
