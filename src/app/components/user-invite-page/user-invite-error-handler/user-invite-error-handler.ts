import { Component, inject } from '@angular/core';
import { UserInviteStateManagementService } from '../../../services/user-invite-state-management-service';

@Component({
  selector: 'app-user-invite-error-handler',
  imports: [],
  templateUrl: './user-invite-error-handler.html',
  styleUrl: './user-invite-error-handler.scss',
})
export class UserInviteErrorHandler {
  public userInviteStateService = inject(UserInviteStateManagementService)
}
