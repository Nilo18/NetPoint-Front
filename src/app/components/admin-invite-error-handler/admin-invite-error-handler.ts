import { Component, inject } from '@angular/core';
import { AdminInviteStateManagementService } from '../../services/admin-invite-state-management-service';

@Component({
  selector: 'app-admin-invite-error-handler',
  imports: [],
  templateUrl: './admin-invite-error-handler.html',
  styleUrl: './admin-invite-error-handler.scss',
})
export class AdminInviteErrorHandler {
  public adminInviteStateService = inject(AdminInviteStateManagementService)
}
