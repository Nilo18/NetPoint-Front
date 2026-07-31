import { Component, inject } from '@angular/core';
import { UserInviteStateManagementService } from '../../../services/user-invite-state-management-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserInviteService } from '../../../services/user-invite-service';
import { FormValidatorService } from '../../../services/form-validator-service';
import { BackendErrorHandlerService } from '../../../services/backend-error-handler-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserInviteSuccessModal } from '../user-invite-success-modal/user-invite-success-modal';

@Component({
  selector: 'app-user-invite-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-invite-form.html',
  styleUrl: './user-invite-form.scss',
})
export class UserInviteForm {
  public userInviteStateService = inject(UserInviteStateManagementService)
  private fb = inject(FormBuilder)
  signupForm!: FormGroup
  private router = inject(Router)
  private userInviteService = inject(UserInviteService)
  private formValidator = inject(FormValidatorService)
  private backendErrorHandler = inject(BackendErrorHandlerService)
  private modalService = inject(NgbModal)

  ngOnInit() {
    if (this.userInviteStateService.shouldShowForm()) {
      this.signupForm = this.fb.group({
        name: ['', [Validators.required]],
        // email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        // phone_number: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
        // role: ['ADMIN']
      })
    }
  }

  async onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched()
      console.log('The form is invalid.')
      return
    }

    this.userInviteStateService.setGotError(false)
    this.userInviteStateService.setBackendErrorMsg('')
    this.userInviteStateService.setRequestSent(true)

    console.log('The form value is: ', this.signupForm.value)
    try {
      const res = await this.userInviteService.completeRegistration(
        this.userInviteStateService.invitationToken(), this.signupForm.value
      )
      this.userInviteStateService.setRequestSent(false)
      const modalRef = this.modalService.open(UserInviteSuccessModal, {
        centered: true,
      })
      modalRef.componentInstance.message = res.message
      // localStorage.setItem('net_token', res.token)
      // this.router.navigate(['/admin'])
    } catch (error: unknown) {
      this.userInviteStateService.setGotError(true)
      this.userInviteStateService.setBackendErrorMsg(this.backendErrorHandler.getErrorMessage(error, 'Could not complete registration. Please try again.'))
      this.userInviteStateService.setRequestSent(false)
    }
  }
  
  getRequiredError(field: string, form: FormGroup): string {
    return this.formValidator.getRequiredError(field, form)
  }

  getEmailError(field: string, form: FormGroup): string {
    return this.formValidator.getFirstError(
      this.formValidator.getRequiredError(field, form),
      this.formValidator.getEmailError(field, form)
    )
  }

  getPasswordError(field: string, form: FormGroup): string {
    return this.formValidator.getFirstError(
      this.formValidator.getRequiredError(field, form),
      this.formValidator.getMinLengthError(field, form)
    )
  }

  getPhoneNumberError(field: string, form: FormGroup): string {
    return this.formValidator.getFirstError(
      this.formValidator.getRequiredError(field, form),
      this.formValidator.getPatternError(field, form, 'Please enter a valid phone number')
    )
  }
}
