import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinner } from '../../components/loading-spinner/loading-spinner';
import { AdminInviteStateManagementService } from '../../services/admin-invite-state-management-service';
import { AdminInviteErrorHandler } from '../../components/admin-invite-page/admin-invite-error-handler/admin-invite-error-handler';
import { AdminInviteForm } from '../../components/admin-invite-page/admin-invite-form/admin-invite-form';

@Component({
  selector: 'app-admin-invite-token-validation',
  imports: [ReactiveFormsModule, LoadingSpinner, AdminInviteErrorHandler, AdminInviteForm],
  templateUrl: './admin-invite-token-validation.html',
  styleUrl: './admin-invite-token-validation.scss',
})
export class AdminInviteTokenValidation {
  private route = inject(ActivatedRoute)
  public adminInviteStateService = inject(AdminInviteStateManagementService)
  adminSignupForm!: FormGroup

  ngOnInit() {
    const invitationToken = this.route.snapshot.queryParams['token']

    if (!invitationToken) {
      console.log('Token not found in the url or name mismatch.')
      return
    }

    this.adminInviteStateService.setInvitationToken(invitationToken)

    this.adminInviteStateService.validateToken()
    console.log(invitationToken)
  }
}
