import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingsPageService } from '../../services/settings-page-service';

@Component({
  selector: 'app-delete-request-error-display-modal',
  imports: [],
  templateUrl: './delete-request-error-display-modal.html',
  styleUrl: './delete-request-error-display-modal.scss',
})
export class DeleteRequestErrorDisplayModal {
  public modal = inject(NgbActiveModal);
  private settingsService = inject(SettingsPageService)
  errTitle!: string
  errMsg!: string

  closeModal() {
    this.settingsService.setIsLoading(false)
    this.modal.close()
  }
}
