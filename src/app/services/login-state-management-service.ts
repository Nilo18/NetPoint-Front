import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginStateManagementService {
  private _showLoginNextStep: WritableSignal<boolean> = signal(false)
  readonly showLoginNextStep = this._showLoginNextStep.asReadonly()
  private _gotBackendLoginError = signal(false)
  readonly gotBackendLoginError = this._gotBackendLoginError.asReadonly()
  private _requestSent = signal(false)
  readonly requestSent = this._requestSent.asReadonly()
  private _backendLoginErrorMsg = signal('')
  readonly backendLoginErrorMsg = this._backendLoginErrorMsg.asReadonly()
  private _role = signal('owner')
  readonly role = this._role.asReadonly()
  private _loginStageOneData = signal<any | null>(null)
  readonly loginStageOneData = this._loginStageOneData.asReadonly()
  private _tempToken = signal<any | null>(null)
  readonly tempToken = this._tempToken.asReadonly()

  setShowLoginNextStep(val: boolean) {
    this._showLoginNextStep.set(val)
    console.log('Set showNextStep to: ', val)
  }

  setGotBackendLoginError(val: boolean) {
    this._gotBackendLoginError.set(val)
    console.log('Set gotBackendLoginError to: ', val)
  }

  setRequestSent(val: boolean) {
    this._requestSent.set(val)
    console.log('Set requestSent to: ', val)
  }

  setBackendLoginErrorMsg(val: string) {
    this._backendLoginErrorMsg.set(val)
    console.log('Set backendLoginErrorMsg to: ', val)
  }

  setRole(val: string) {
    this._role.set(val)
    console.log('Set role to: ', val)
  }

  setStageOneData(val: any) {
    this._loginStageOneData.set(val)
    console.log('Set stageOneData to: ', val)
  }

  setTempToken(val: any) {
    this._tempToken.set(val)
    console.log('Set tempToken to: ', val)
  }
}
