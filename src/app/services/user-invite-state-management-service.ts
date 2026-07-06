import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { UserInviteService } from './user-invite-service';
import { BackendErrorHandlerService } from './backend-error-handler-service';

@Injectable({
  providedIn: 'root',
})
export class UserInviteStateManagementService {
  private _gotError: WritableSignal<boolean> = signal(false)
  readonly gotError = this._gotError.asReadonly()
  private _backendErrorMsg: WritableSignal<string> = signal('')
  readonly backendErrorMsg = this._backendErrorMsg.asReadonly()
  private _invitationToken: WritableSignal<string> = signal('')
  readonly invitationToken = this._invitationToken.asReadonly()
  private _shouldShowForm: WritableSignal<boolean> = signal(false)
  readonly shouldShowForm = this._shouldShowForm.asReadonly()
  private _successfulResMsg: WritableSignal<string> = signal('')
  readonly successfulResMsg = this._successfulResMsg.asReadonly()
  private _requestSent: WritableSignal<boolean> = signal(false)
  readonly requestSent = this._requestSent.asReadonly()
  private userInviteService = inject(UserInviteService)
  private backendErrorHandler = inject(BackendErrorHandlerService)

  setGotError(value: boolean): void {
    this._gotError.set(value);
  }

  setBackendErrorMsg(value: string): void {
    this._backendErrorMsg.set(value);
  }

  setInvitationToken(value: string): void {
    this._invitationToken.set(value);
  }

  setShouldShowForm(value: boolean): void {
    this._shouldShowForm.set(value);
  }

  setSuccessfulResMsg(value: string): void {
    this._successfulResMsg.set(value);
  }

  setRequestSent(value: boolean): void {
    this._requestSent.set(value);
  }

  async validateToken() {
    if (!this.invitationToken()) {
      this.setGotError(true)
      this.setBackendErrorMsg('Invitation token is missing')
      return
    }

    this.setGotError(false)
    this.setBackendErrorMsg('')

    try {
      const res = await this.userInviteService.verifyInvitation(this.invitationToken()) 
      // if (res.status === 200) {
      this.setSuccessfulResMsg(res.message)

      // this.adminSignupForm = this.fb.group({
      //   name: ['', [Validators.required]],
      //   // email: ['', [Validators.required, Validators.email]],
      //   password: ['', [Validators.required, Validators.minLength(8)]],
      //   // phone_number: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      //   // role: ['ADMIN']
      // })

      this.setShouldShowForm(true)
      // }
    } catch (error: unknown) {
      this.setGotError(true)
      this.setBackendErrorMsg(this.backendErrorHandler.getErrorMessage(error, 'Invitation could not be verified. Please try again.'))
    }
  }

}
