import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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

  title = '';
  description = '';

  confirm(): void {
    this.modal.close(true);
  }
}
