import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { jwtDecode } from 'jwt-decode';
import { SettingsPageService } from '../../../services/settings-page-service';
import { FormValidatorService } from '../../../services/form-validator-service';
import { BackendErrorHandlerService } from '../../../services/backend-error-handler-service';

@Component({
  selector: 'app-settings-add-user-modal',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './settings-add-user-modal.html',
  styleUrl: './settings-add-user-modal.scss',
})
export class SettingsAddUserModal {
  public modal = inject(NgbActiveModal);
  private fb = inject(FormBuilder)
  private settingsService = inject(SettingsPageService)
  private formValidator = inject(FormValidatorService)
  private backendErrorHandler = inject(BackendErrorHandlerService)
  userInviteForm!: FormGroup
  // cashierAdditionForm!: FormGroup
  role: WritableSignal<string> = signal('ADMIN')
  requestSent: WritableSignal<boolean> = signal(false)
  gotBackendError: WritableSignal<boolean> = signal(false)
  success: WritableSignal<boolean> = signal(false)
  backendErrMsg: WritableSignal<string> = signal('')
  decodedToken!: any

  constructor() {
    effect(() => {
      this.userInviteForm?.patchValue({ role: this.role() })
    })
  }

  ngOnInit() {
    const token = localStorage.getItem('net_token')
    
    if (token) {
      this.decodedToken = jwtDecode(token)

      this.userInviteForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        role: [this.role(), [Validators.required]],
        companyId: [this.decodedToken.companyId, [Validators.required]]
      })
    }
  }

  setRole(value: string) {
    console.log("setRole() is running...")
    this.role.set(value)
    console.log('The role is: ', this.role())
  }

  async inviteUser() {
    if (this.userInviteForm.invalid) {
      this.userInviteForm.markAllAsTouched()
      console.log('Invalid form: ', this.userInviteForm.value)
      return
    }

    this.requestSent.set(true)
    this.gotBackendError.set(false)
    this.backendErrMsg.set('')
    this.success.set(false)
    console.log(this.userInviteForm.value)
    try {
      const res = await this.settingsService.inviteAdmin(this.userInviteForm.value) 

      if (res) {
        this.success.set(true)
        setTimeout(() => {
          this.modal.close()
        }, 2000)
      }
    } catch (error: unknown) {
      this.requestSent.set(false)
      this.gotBackendError.set(true)
      this.success.set(false)
      this.backendErrMsg.set(this.backendErrorHandler.getErrorMessage(error, 'Could not invite user. Please try again.'))
    }
  }

  getEmailError(field: string, form: FormGroup): string {
    return this.formValidator.getFirstError(
      this.formValidator.getRequiredError(field, form),
      this.formValidator.getEmailError(field, form)
    )
  }
}
