import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentPlan, SettingsPageService } from '../../../services/settings-page-service';
import { SettingsBillingPlanChangerModal } from '../settings-billing-plan-changer-modal/settings-billing-plan-changer-modal';
import { ConfirmActionModal } from '../../confirm-action-modal/confirm-action-modal';
import { DeleteRequestErrorDisplayModal } from '../../delete-request-error-display-modal/delete-request-error-display-modal';

@Component({
  selector: 'app-settings-billing',
  imports: [],
  templateUrl: './settings-billing.html',
  styleUrl: './settings-billing.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsBilling {
  private settingsService = inject(SettingsPageService)
  private modalService = inject(NgbModal)
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

  openPlanChangerModal(): void {
    const modalRef = this.modalService.open(SettingsBillingPlanChangerModal, {
      centered: true,
      backdrop: true,
      // size: 'xl',
      windowClass: 'billing-plan-modal-window',
    })

    modalRef.componentInstance.selectedPlan = this.paymentPlan()?.planName
  }

  cancelSubscription() {
    const modalRef = this.modalService.open(ConfirmActionModal, {
      centered: true
    })

    modalRef.componentInstance.title = 'Cancel Subscription Confirmation'
    modalRef.componentInstance.description = 'Are you sure you want to cancel your subscription?'

    modalRef.result.then(async (confirmed) => {
      if (confirmed) {
        try {
          const res = await this.settingsService.cancelSubscription()
          if (res) {
            window.location.reload()
          }
        } catch (error: any) {
          const errorModalRef = this.modalService.open(DeleteRequestErrorDisplayModal, {
            centered: true
          })

          errorModalRef.componentInstance.errTitle = 'Something went wrong while cancelling your subscription'
          errorModalRef.componentInstance.errMsg = error.error.error
        }
      }
    })
  }
}
