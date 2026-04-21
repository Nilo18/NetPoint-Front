import { Injectable, signal, WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class SignupStateManagementService {
  private _showNextStep: WritableSignal<boolean> = signal(false)
  readonly showNextStep = this._showNextStep.asReadonly()
  private _gotBackendError = signal(false)
  readonly gotBackendError = this._gotBackendError.asReadonly()
  private _requestSent = signal(false)
  readonly requestSent = this._requestSent.asReadonly()
  private _backendErrorMsg = signal('')
  readonly backendErrorMsg = this._backendErrorMsg.asReadonly()
  private _stageOneData = signal<any>(null)
  readonly stageOneData = this._stageOneData.asReadonly()
  private _stageTwoData = signal<any>(null)
  readonly stageTwoData = this._stageTwoData.asReadonly()

  setStageOneData(val: any) {
    this._stageOneData.set(val)
  }

  setStageTwoData(val: any) {
    this._stageTwoData.set(val)
  }

  setShowNextStep(stageOneData: any, val: boolean) {
    this._stageOneData.set(stageOneData)
    console.log('Stage 1 data is: ', this.stageOneData())
    this._showNextStep.set(val)
    console.log('Set showNextStep to: ', val)
  }

  setGotBackendError(val: boolean) {
    this._gotBackendError.set(val)
    console.log('Set gotBackendError to: ', val)
  }

  setRequestSent(val: boolean) {
    this._requestSent.set(val)
    console.log('Set requestSent to: ', val)
  }

  setBackendErrorMsg(val: string) {
    this._backendErrorMsg.set(val)
    console.log('Set gotBackendError to: ', val)
  }

  buildFinalPayload(stageTwoData: any) {
    const { confirm_password, ...stageOne } = this._stageOneData()
    return { ...stageOne, ...stageTwoData }
  }

  hardRefreshSignupState() {
    this._showNextStep.set(false)
    this._gotBackendError.set(false)
    this._requestSent.set(false)
    this._backendErrorMsg.set('')
    this._stageOneData.set(null)
    this._stageTwoData.set(null)
  }
}
