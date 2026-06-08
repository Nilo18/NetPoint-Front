import { ChangeDetectionStrategy, Component, computed, inject, resource, signal, WritableSignal } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentPlan, SettingsPageService } from '../../../services/settings-page-service';
import { SettingsBillingPlanChangerModal } from '../settings-billing-plan-changer-modal/settings-billing-plan-changer-modal';
import { ConfirmActionModal } from '../../confirm-action-modal/confirm-action-modal';
import { DeleteRequestErrorDisplayModal } from '../../delete-request-error-display-modal/delete-request-error-display-modal';
import { BackendErrorOverlay } from '../../backend-error-overlay/backend-error-overlay';

type CardBrand = 'visa' | 'mastercard' | 'unknown';

interface CardBrandDisplay {
  brand: CardBrand;
  label: string;
  ariaLabel: string;
}

@Component({
  selector: 'app-settings-billing',
  imports: [BackendErrorOverlay],
  templateUrl: './settings-billing.html',
  styleUrl: './settings-billing.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsBilling {
  public settingsService = inject(SettingsPageService)
  private modalService = inject(NgbModal)
  paymentPlan: WritableSignal<PaymentPlan | null> = signal(null)
  gotBackendError = signal(false)
  backendErrMsg = signal('')
  currentYear: number = new Date().getFullYear()
  paymentMethod = resource({
    loader: () => this.settingsService.getPaymentMethod()
  })
  cardBrandDisplay = computed<CardBrandDisplay>(() => {
    const brand = this.normalizeCardBrand(this.paymentMethod.value()?.cardBrand)
    const labelByBrand: Record<CardBrand, string> = {
      visa: 'VISA',
      mastercard: 'Mastercard',
      unknown: 'Card',
    }

    return {
      brand,
      label: labelByBrand[brand],
      ariaLabel: `${labelByBrand[brand]} card`,
    }
  })

  async ngOnInit() {
    console.log(this.paymentMethod.value())
    this.settingsService.setIsLoading(true)
    // this.currentYear = 

    try {
      const res = await this.settingsService.getPaymentPlan()
      this.paymentPlan.set(res)
      this.gotBackendError.set(false)
      this.backendErrMsg.set('')
      console.log(`Assigned paymentPlan: `, this.paymentPlan)
    } catch (error: any) {
      this.gotBackendError.set(true)
      this.backendErrMsg.set(error.error?.error ?? 'Could not load billing information.')
    } finally {
      this.settingsService.setIsLoading(false)
    }
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

  async openPaymentMethodModal() {
    const { SettingsBillingAddPaymentMethodModal } = await import(
      '../settings-billing-add-payment-method-modal/settings-billing-add-payment-method-modal'
    )

    this.modalService.open(SettingsBillingAddPaymentMethodModal, {
      centered: true
    })
  }

  cancelSubscription() {
    const modalRef = this.modalService.open(ConfirmActionModal, {
      centered: true
    })

    modalRef.componentInstance.title = 'Cancel Subscription Confirmation'
    modalRef.componentInstance.description = 'Are you sure you want to cancel your subscription?'
    modalRef.componentInstance.confirmAction = async () => {
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
        errorModalRef.componentInstance.errMsg = error.error?.error ?? 'Please try again later.'
        throw error
      }
    }
  }

  formatExpiryYear(year: number | undefined) {
    // const monthString = String(month)
    const yearString = String(year)
    return yearString.substring(2, 4)   
  }

  private normalizeCardBrand(brand: string | undefined): CardBrand {
    const normalizedBrand = brand?.trim().toLowerCase().replace(/[\s_-]/g, '')

    switch (normalizedBrand) {
      case 'visa':
      case 'mastercard':
        return normalizedBrand
      default:
        return 'unknown'
    }
  }
}
