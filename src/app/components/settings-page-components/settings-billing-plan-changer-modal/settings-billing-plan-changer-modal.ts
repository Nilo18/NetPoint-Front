import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingsPageService } from '../../../services/settings-page-service';

interface BillingPlanOption {
  name: string;
  label: string;
  description: string;
  price: number;
  features: string[];
  badge?: string;
  action: string;
}

@Component({
  selector: 'app-settings-billing-plan-changer-modal',
  imports: [],
  templateUrl: './settings-billing-plan-changer-modal.html',
  styleUrl: './settings-billing-plan-changer-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsBillingPlanChangerModal {
  protected readonly modal = inject(NgbActiveModal);
  selectedPlan = 'Starter Plan';
  private settingsService = inject(SettingsPageService)
  protected readonly requestSent = signal(false);
  protected readonly pendingPlan = signal('');
  protected readonly backendErrMsg = signal('');
  private readonly planOrder: Record<string, number> = {
    'Starter Plan': 0,
    'Professional Plan': 1,
    'Business Plus Plan': 2,
  };

  protected readonly plans: BillingPlanOption[] = [
    {
      name: 'Starter Plan',
      label: 'Starter',
      description: 'For small shops getting started',
      price: 0,
      features: [
        'Up to 100 products in catalog',
        '5 Team members (2 Admins + 3 Cashiers)',
        'Standard Sales Reports',
        '7-day Activity Log retention',
      ],
      action: 'Current Plan',
    },
    {
      name: 'Professional Plan',
      label: 'Professional',
      description: 'For growing businesses',
      price: 49,
      features: [
        'Unlimited products',
        'Up to 10 team members',
        'Advanced analytics',
        '30-day Activity Log retention',
      ],
      badge: 'Most Popular',
      action: 'Upgrade',
    },
    {
      name: 'Business Plus Plan',
      label: 'Business Plus',
      description: 'For large-scale operations',
      price: 99,
      features: [
        'Unlimited products',
        'Unlimited team members',
        'Full Audit Suite',
        '90-day Activity Log retention',
      ],
      action: 'Upgrade',
    },
  ];

  async selectPlan(planName: string) {
    if (this.requestSent() || this.isSelected(planName)) {
      return;
    }

    this.requestSent.set(true);
    this.pendingPlan.set(planName);
    this.backendErrMsg.set('');

    try {
      const res = await this.settingsService.changePaymentPlan(planName)
      if (res) {
        window.location.reload()
      }
    } catch (error: any) {
      console.log(error.error.error)
      this.backendErrMsg.set(error.error?.error ?? 'Could not change your plan. Please try again.')
    } finally {
      this.requestSent.set(false);
      this.pendingPlan.set('');
    }
  }

  protected isSelected(planName: string): boolean {
    return this.selectedPlan === planName;
  }

  determinePlanButtonText(planName: string): string {
    if (this.pendingPlan() === planName) {
      return 'Changing...';
    }

    if (this.isSelected(planName)) {
      return 'Current Plan';
    }

    const selectedPlanLevel = this.planOrder[this.selectedPlan] ?? 0;
    const targetPlanLevel = this.planOrder[planName] ?? 0;

    return targetPlanLevel < selectedPlanLevel ? 'Downgrade' : 'Upgrade';
  }
}
