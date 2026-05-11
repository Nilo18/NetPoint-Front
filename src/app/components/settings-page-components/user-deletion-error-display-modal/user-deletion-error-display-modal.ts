import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingsPageService } from '../../../services/settings-page-service';

@Component({
  selector: 'app-user-deletion-error-display-modal',
  imports: [],
  templateUrl: './user-deletion-error-display-modal.html',
  styleUrl: './user-deletion-error-display-modal.scss',
})
export class UserDeletionErrorDisplayModal {
  public modal = inject(NgbActiveModal);
  private settingsService = inject(SettingsPageService)
  errMsg: string = ''

  closeModal() {
    this.settingsService.setIsLoading(false)
    this.modal.close()
  }
}
