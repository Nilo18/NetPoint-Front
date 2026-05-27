import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { SettingsPageService, User } from '../../../services/settings-page-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormValidatorService } from '../../../services/form-validator-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserInfoUpdateValidatorModal } from '../user-info-update-validator-modal/user-info-update-validator-modal';
import { HttpErrorResponse } from '@angular/common/http';

interface UserInfoFormValue extends User {
  newPassword: string | null
}

@Component({
  selector: 'app-settings-personal-info',
  imports: [ReactiveFormsModule],
  templateUrl: './settings-personal-info.html',
  styleUrl: './settings-personal-info.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPersonalInfo {
  private settingsService = inject(SettingsPageService)
  private fb = inject(FormBuilder)
  private formValidator = inject(FormValidatorService)
  private modalService = inject(NgbModal)
  userInfoForm!: FormGroup
  userInfo: UserInfoFormValue = {
    id: -1,
    name: '',
    email: '',
    role: '',
    newPassword: null
  }
  gotBackendError: WritableSignal<boolean> = signal(false)
  errMsg: WritableSignal<string> = signal('')
  requestSent: WritableSignal<boolean> = signal(false)
  isLoading: WritableSignal<boolean> = signal(true)

  async ngOnInit() {
    this.userInfoForm = this.fb.group({
      id: [-1 , [Validators.required]],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]],
      newPassword: [null, [Validators.minLength(8)]]
    })

    try {
      const res = await this.settingsService.getUserInfo()
      this.isLoading.set(false)
      this.userInfo = {
        ...res,
        newPassword: null
      }

      console.log('The new userInfo is: ', this.userInfo)

      console.log('HELLO WORLD')
      this.userInfoForm.patchValue({
        id: res.id,
        name: res.name,
        email: res.email,
        role: res.role,
        newPassword: null
      })
      // console.log('userInfoForm after patching new values: ', this.userInfoForm.value)
      // console.log('role control:', this.userInfoForm.get('role')?.value);
    } catch (error: unknown) {
      this.isLoading.set(false)
      this.gotBackendError.set(true)
      this.errMsg.set(this.getBackendErrorMessage(error))
      console.log(error)
    }
  }

  getError(field: string, form: FormGroup) {
    return this.formValidator.getError(field, form)
  }

  async onSubmit() {
    if (this.requestSent() === true) {
      console.log('Request already sent')
      return
    }

    if (JSON.stringify(this.userInfo) === JSON.stringify(this.userInfoForm.value)) {
      console.log('Form has not changed, avoiding request')
      return
    }

    if (this.userInfoForm.invalid) {
      this.userInfoForm.markAllAsTouched()
      console.log('Invalid form.')
      return
    }

    this.requestSent.set(true)
    this.gotBackendError.set(false)
    this.errMsg.set('')

    try {
      console.log(this.userInfoForm.value)
      const res = await this.settingsService.verifyPersonalInfoUpdateRequest(this.userInfoForm.value)
      if (res) {
        this.requestSent.set(false)
        const modalRef = this.modalService.open(UserInfoUpdateValidatorModal, {
          centered: true
        })

        // const { newPassword, ...payload } = this.userInfoForm.value
        modalRef.componentInstance.tempToken = res.tempToken
        // modalRef.componentInstance.newPassword = newPassword || null
        modalRef.componentInstance.userInfo = this.userInfoForm.value
      }
    } catch (error: unknown) {
      this.requestSent.set(false)
      this.gotBackendError.set(true)
      this.errMsg.set(this.getBackendErrorMessage(error))
      console.log(error)
    }
  }

  private getBackendErrorMessage(error: unknown) {
    if (error instanceof HttpErrorResponse && typeof error.error?.error === 'string') {
      return error.error.error
    }

    return 'Something went wrong. Please try again.'
  }
}
