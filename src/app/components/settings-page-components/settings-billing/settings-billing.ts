import { Component, inject, signal, WritableSignal } from '@angular/core';
import { PaymentPlan, SettingsPageService } from '../../../services/settings-page-service';

@Component({
  selector: 'app-settings-billing',
  imports: [],
  templateUrl: './settings-billing.html',
  styleUrl: './settings-billing.scss',
})
export class SettingsBilling {
  private settingsService = inject(SettingsPageService)
  paymentPlan: WritableSignal<PaymentPlan | null> = signal(null)

  async ngOnInit() {
    const res = await this.settingsService.getPaymentPlan()
    this.paymentPlan.set(res)
    console.log(`Assigned paymentPlan: `, this.paymentPlan)
  }

  get isFreeTier() {
    const stdPlanName = this.paymentPlan()?.planName.trim().toLowerCase()
    return stdPlanName === 'starter plan'
  }
}
