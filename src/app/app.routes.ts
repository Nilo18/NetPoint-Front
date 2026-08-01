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
import { settingsChildGuard, settingsPageGuard } from './guards/settings-page-guard';
import { authGuard } from './guards/auth-guard';
import { basicGuard } from './guards/basic-guard';
import { inviteTokenGuard } from './guards/invite-token-guard';
import { AuditLogPage } from './pages/audit-log-page/audit-log-page';
import { SalesHistoryPage } from './pages/sales-history-page/sales-history-page';

export const routes: Routes = [
    {path: "", component: Home, canActivate: [authGuard]},
    {path: "signup", component: Signup, canActivate: [authGuard]},
    {path: "login", component: Login, canActivate: [authGuard]},
    {path: "expenses", component: ExpenseCalculator, canActivate: [basicGuard]},
    {path: "admin", component: AdminDashboard, canActivate: [adminDashboardGuard]},
    {path: "settings", canActivate: [settingsPageGuard], canActivateChild: [settingsChildGuard], component: Settings,
        children: [
            { path: "", component: SettingsUserManagement },
            { path: "personal-info", component: SettingsPersonalInfo },
            { path: "business-info", component: BusinessInfo },
            { path: "notifications", component: SettingsNotifications },
            { path: "security", component: SettingsSecurity },
            { path: "appearance", component: SettingsAppearance },
            { path: "billing", component: SettingsBilling },
        ],
    },
    {path: "setup-account", component: UserInviteTokenValidation, canActivate: [inviteTokenGuard]},
    {path: "audit-logs", component: AuditLogPage, canActivate: [adminDashboardGuard]},
    {path: "sales", component: SalesHistoryPage, canActivate: [adminDashboardGuard]},
    {
        path: "security",
        canActivate: [authGuard],
        loadComponent: () =>
            import('./pages/security-details-page/security-details-page').then(
                ({ SecurityDetailsPage }) => SecurityDetailsPage
            ),
    },
    {
        path: "solutions",
        canActivate: [authGuard],
        loadComponent: () =>
            import('./pages/solutions-page/solutions-page').then(
                ({ SolutionsPage }) => SolutionsPage
            ),
    },
    {
        path: "privacy",
        loadComponent: () =>
            import('./pages/privacy-page/privacy-page').then(
                ({ PrivacyPage }) => PrivacyPage
            ),
    },
    {
        path: "terms",
        loadComponent: () =>
            import('./pages/terms-page/terms-page').then(
                ({ TermsPage }) => TermsPage
            ),
    },
    {
        path: "pricing",
        loadComponent: () =>
            import('./pages/pricing-page/pricing-page').then(
                ({PricingPage}) => PricingPage
            )
    },
    {
        path: "compliance",
        loadComponent: () =>
            import('./pages/compliance-page/compliance-page').then(
                ({ CompliancePage }) => CompliancePage
            ),
    },
    {path: "**", component: NotFoundPage}
];
