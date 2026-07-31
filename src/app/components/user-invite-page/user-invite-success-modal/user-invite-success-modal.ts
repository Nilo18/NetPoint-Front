import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-invite-success-modal',
  imports: [],
  templateUrl: './user-invite-success-modal.html',
  styleUrl: './user-invite-success-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInviteSuccessModal {
  protected readonly modal = inject(NgbActiveModal);

  message = '';
}
