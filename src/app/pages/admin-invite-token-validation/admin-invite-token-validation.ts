import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminInviteService } from '../../services/admin-invite-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormValidatorService } from '../../services/form-validator-service';
import { LoadingSpinner } from '../../components/loading-spinner/loading-spinner';
import { AdminInviteStateManagementService } from '../../services/admin-invite-state-management-service';
import { AdminInviteErrorHandler } from '../../components/admin-invite-error-handler/admin-invite-error-handler';

@Component({
  selector: 'app-admin-invite-token-validation',
  imports: [ReactiveFormsModule, LoadingSpinner, AdminInviteErrorHandler],
  templateUrl: './admin-invite-token-validation.html',
  styleUrl: './admin-invite-token-validation.scss',
})
export class AdminInviteTokenValidation {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private adminInviteService = inject(AdminInviteService)
  public adminInviteStateService = inject(AdminInviteStateManagementService)
  private fb = inject(FormBuilder)
  private formValidator = inject(FormValidatorService)
  // private adminInvite
  adminSignupForm!: FormGroup

  ngOnInit() {
    const invitationToken = this.route.snapshot.queryParams['token']

    if (!invitationToken) {
      console.log('Token not found in the url or name mismatch.')
      return
    }

    this.adminInviteStateService.setInvitationToken(invitationToken)

    this.adminInviteStateService.validateToken()

    if (this.adminInviteStateService.shouldShowForm()) {
      this.adminSignupForm = this.fb.group({
        name: ['', [Validators.required]],
        // email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        // phone_number: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
        // role: ['ADMIN']
      })
    }

    console.log(invitationToken)
  }

  getError(field: string, form: FormGroup) {
    return this.formValidator.getError(field, form)
  }

  async onSubmit() {
    if (this.adminSignupForm.invalid) {
      this.adminSignupForm.markAllAsTouched()
      console.log('The form is invalid.')
      return
    }

    this.adminInviteStateService.setGotError(false)
    this.adminInviteStateService.setBackendErrorMsg('')

    console.log('The form value is: ', this.adminSignupForm.value)
    try {
      const res = await this.adminInviteService.completeRegistration(
        this.adminInviteStateService.invitationToken(), this.adminSignupForm.value
      )
      localStorage.setItem('net_token', res.token)
      this.router.navigate(['/admin'])    
    } catch (error: any) {
      this.adminInviteStateService.setGotError(true)
      this.adminInviteStateService.setBackendErrorMsg(error.error.error)
    }
  }
}
