import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinner } from '../../components/loading-spinner/loading-spinner';
import { UserInviteStateManagementService } from '../../services/user-invite-state-management-service';
import { UserInviteErrorHandler } from '../../components/user-invite-page/user-invite-error-handler/user-invite-error-handler';
import { UserInviteForm } from '../../components/user-invite-page/user-invite-form/user-invite-form';

@Component({
  selector: 'app-user-invite-token-validation',
  imports: [ReactiveFormsModule, LoadingSpinner, UserInviteErrorHandler, UserInviteForm],
  templateUrl: './user-invite-token-validation.html',
  styleUrl: './user-invite-token-validation.scss',
})
export class UserInviteTokenValidation {
  private route = inject(ActivatedRoute)
  public userInviteStateService = inject(UserInviteStateManagementService)
  signupForm!: FormGroup

  ngOnInit() {
    const invitationToken = this.route.snapshot.queryParams['token']

    if (!invitationToken) {
      console.log('Token not found in the url or name mismatch.')
      return
    }

    this.userInviteStateService.setInvitationToken(invitationToken)

    this.userInviteStateService.validateToken()
    console.log(invitationToken)
  }
}
