import { Component, inject } from '@angular/core';
import { AdminInviteStateManagementService } from '../../../services/admin-invite-state-management-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminInviteService } from '../../../services/admin-invite-service';
import { FormValidatorService } from '../../../services/form-validator-service';

@Component({
  selector: 'app-admin-invite-form',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-invite-form.html',
  styleUrl: './admin-invite-form.scss',
})
export class AdminInviteForm {
  public adminInviteStateService = inject(AdminInviteStateManagementService)
  private fb = inject(FormBuilder)
  adminSignupForm!: FormGroup
  private router = inject(Router)
  private adminInviteService = inject(AdminInviteService)
  private formValidator = inject(FormValidatorService)

  ngOnInit() {
    if (this.adminInviteStateService.shouldShowForm()) {
      this.adminSignupForm = this.fb.group({
        name: ['', [Validators.required]],
        // email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        // phone_number: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
        // role: ['ADMIN']
      })
    }
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
  
  getError(field: string, form: FormGroup) {
    return this.formValidator.getError(field, form)
  }
}
