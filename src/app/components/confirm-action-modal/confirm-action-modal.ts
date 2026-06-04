import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-action-modal',
  imports: [],
  templateUrl: './confirm-action-modal.html',
  styleUrl: './confirm-action-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmActionModal {
  protected readonly modal = inject(NgbActiveModal);
  protected readonly isLoading = signal(false);

  title = '';
  description = '';
  confirmAction?: () => Promise<void>;

  async confirm(): Promise<void> {
    if (!this.confirmAction) {
      this.modal.close(true);
      return;
    }

    this.isLoading.set(true);

    try {
      await this.confirmAction();
      this.modal.close(true);
    } catch {
      // The caller owns the error display; keep this modal open so the user can retry or cancel.
    } finally {
      this.isLoading.set(false);
    }
  }
}
