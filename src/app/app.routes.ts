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
import { BusinessInfo } from './components/settings-page-components/business-info/business-info';
import { SettingsUserManagement } from './components/settings-page-components/settings-user-management/settings-user-management';
import { SettingsNotifications } from './components/settings-page-components/settings-notifications/settings-notifications';
import { SettingsSecurity } from './components/settings-page-components/settings-security/settings-security';
import { SettingsAppearance } from './components/settings-page-components/settings-appearance/settings-appearance';
import { SettingsBilling } from './components/settings-page-components/settings-billing/settings-billing';
import { SettingsPersonalInfo } from './components/settings-page-components/settings-personal-info/settings-personal-info';

export const routes: Routes = [
    {path: "", component: Home},
    {path: "signup", component: Signup},
    {path: "login", component: Login},
    {path: "expenses", component: ExpenseCalculator},
    {path: "admin", component: AdminDashboard, canActivate: [adminDashboardGuard]},
    {path: "settings", component: Settings,
        children: [
            { path: "", component: SettingsUserManagement },
            { path: "personal-info", component: SettingsPersonalInfo },
            { path: "business-info", component: BusinessInfo },
            { path: "notifications", component: SettingsNotifications },
            { path: "security", component: SettingsSecurity },
            { path: "appearance", component: SettingsAppearance },
            { path: "billing", component: SettingsBilling },
        ]
    },
    {path: "setup-account", component: UserInviteTokenValidation},
    {path: "**", component: NotFoundPage}
];
