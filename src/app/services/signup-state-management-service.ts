import { Injectable, signal, WritableSignal } from '@angular/core';

export interface SignupStageOneData {
  name: string
  email: string
  industry: string
  password: string
  // confirm_password: string
}

export interface SignupStageTwoData {
  owner_name: string
  owner_email: string
  owner_password: string
  role: string
}

export interface SignupVerificationData {
  companyOtpCode: string
  companyTempToken: string
  userOtpCode: string
  userTempToken: string
}

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
  private _stageOneData = signal<SignupStageOneData | null>(null)
  readonly stageOneData = this._stageOneData.asReadonly()
  private _stageTwoData = signal<SignupStageTwoData | null>(null)
  readonly stageTwoData = this._stageTwoData.asReadonly()
  private _companyImage = signal<File | null>(null)
  readonly companyImage = this._companyImage.asReadonly()
  private _profileImage = signal<File | null>(null)
  readonly profileImage = this._profileImage.asReadonly()

  setStageOneData(val: SignupStageOneData) {
    this._stageOneData.set(val)
  }

  setStageTwoData(val: SignupStageTwoData) {
    this._stageTwoData.set(val)
  }

  setShowNextStep(stageOneData: SignupStageOneData, val: boolean) {
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

  setCompanyImage(file: File | null) {
    this._companyImage.set(file)
  }

  setProfileImage(file: File | null) {
    this._profileImage.set(file)
  }

  buildFinalPayload(
    stageTwoData: SignupStageTwoData,
    verificationData?: SignupVerificationData,
    suppliedStageOneData?: SignupStageOneData,
  ) {
    const stageOneData = suppliedStageOneData ?? this._stageOneData()
    if (!stageOneData) {
      throw new Error('Signup stage one data is missing.')
    }

    // const { confirm_password: _confirmPassword, ...stageOne } = stageOneData
    const formData = new FormData()
    formData.append(
      'data',
      new Blob(
        [JSON.stringify({ ...stageOneData, ...stageTwoData, ...verificationData })],
        { type: 'application/json' },
      ),
    )

    const companyImage = this._companyImage()
    const profileImage = this._profileImage()
    if (companyImage) formData.append('logo', companyImage)
    if (profileImage) formData.append('profileImage', profileImage)

    return formData
  }

  hardRefreshSignupState() {
    this._showNextStep.set(false)
    this._gotBackendError.set(false)
    this._requestSent.set(false)
    this._backendErrorMsg.set('')
    this._stageOneData.set(null)
    this._stageTwoData.set(null)
    this._companyImage.set(null)
    this._profileImage.set(null)
  }
}
