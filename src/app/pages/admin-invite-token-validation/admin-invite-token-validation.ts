import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminInviteService } from '../../services/admin-invite-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormValidatorService } from '../../services/form-validator-service';
import { LoadingSpinner } from '../../components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-admin-invite-token-validation',
  imports: [ReactiveFormsModule, LoadingSpinner],
  templateUrl: './admin-invite-token-validation.html',
  styleUrl: './admin-invite-token-validation.scss',
})
export class AdminInviteTokenValidation {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private adminInviteService = inject(AdminInviteService)
  private fb = inject(FormBuilder)
  private formValidator = inject(FormValidatorService)
  adminSignupForm!: FormGroup
  shouldShowForm: WritableSignal<boolean> = signal(false)
  successfulResMsg: string = ''
  invitationToken!: string
  gotError: WritableSignal<boolean> = signal(false)
  backendErrorMsg: WritableSignal<string> = signal('')

  ngOnInit() {
    const invitationToken = this.route.snapshot.queryParams['token']

    if (!invitationToken) {
      console.log('Token not found in the url or name mismatch.')
      return
    }

    this.invitationToken = invitationToken

    this.validateToken()

    console.log(invitationToken)
  }

  async validateToken() {
    if (!this.invitationToken) {
      this.gotError.set(true)
      this.backendErrorMsg.set('Invitation token missing')
      return
    }

    this.gotError.set(false)
    this.backendErrorMsg.set('')

    try {
      const res = await this.adminInviteService.verifyInvitation(this.invitationToken) 
      // if (res.status === 200) {
      this.successfulResMsg = res.message

      this.adminSignupForm = this.fb.group({
        name: ['', [Validators.required]],
        // email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        // phone_number: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
        // role: ['ADMIN']
      })

      this.shouldShowForm.set(true)
      // }
    } catch (error: any) {
      this.gotError.set(true)
      this.backendErrorMsg.set(error.error.error)
    }
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

    this.gotError.set(false)
    this.backendErrorMsg.set('')

    console.log('The form value is: ', this.adminSignupForm.value)
    try {
      const res = await this.adminInviteService.completeRegistration(this.invitationToken, this.adminSignupForm.value)
      localStorage.setItem('net_token', res.token)
      this.router.navigate(['/admin'])    
    } catch (error: any) {
      this.gotError.set(true)
      this.backendErrorMsg.set(error.error.error)
    }
  }
}
